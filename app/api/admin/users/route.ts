import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { hashPassword } from "@/lib/auth"
import { logAudit } from "@/lib/audit"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const url = new URL(request.url)
    const q = url.searchParams.get("q")?.trim()
    const role = url.searchParams.get("role") as
      | "client"
      | "fundi"
      | "admin"
      | null

    const where: Record<string, unknown> = {}
    if (role) where.role = role
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ]
    }

    const users = await db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        fundiProfile: {
          select: {
            isPremium: true,
            rating: true,
            reviews: true,
            jobsCompleted: true,
          },
        },
        clientProfile: {
          select: { projectCategory: true, projectLocation: true },
        },
      },
      take: 500,
    })

    const safe = users.map(({ password, ...u }) => u)
    return NextResponse.json({ users: safe })
  } catch (err) {
    console.error("admin users list error:", err)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const { error, user: adminUser } = await requireAdmin()
  if (error) return error

  try {
    const body = await request.json()
    const { name, phone, password, role, email } = body as {
      name?: string
      phone?: string
      password?: string
      role?: "client" | "fundi" | "admin"
      email?: string
    }

    if (!name?.trim() || !phone?.trim() || !password || !role) {
      return NextResponse.json(
        { error: "name, phone, password and role are required" },
        { status: 400 }
      )
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "")
    const userEmail = email?.trim() || `${cleanPhone}@fundihub.com`

    const existing = await db.user.findUnique({ where: { email: userEmail } })
    if (existing) {
      return NextResponse.json(
        { error: "A user with that phone / email already exists" },
        { status: 409 }
      )
    }

    const created = await db.user.create({
      data: {
        name: name.trim(),
        phone,
        email: userEmail,
        password: hashPassword(password),
        role,
      },
    })

    await logAudit({
      action: "ADMIN_USER_CREATED",
      details: `Admin ${adminUser?.name} created ${role} ${created.name} (${created.id})`,
      req: request,
      userId: adminUser?.id,
    })

    const { password: _pw, ...safe } = created
    return NextResponse.json({ user: safe }, { status: 201 })
  } catch (err) {
    console.error("admin create user error:", err)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}
