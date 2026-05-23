import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { logAudit } from "@/lib/audit"

export const dynamic = "force-dynamic"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const categories = await db.category.findMany({ orderBy: { name: "asc" } })
    // Add fundi counts
    const counts = await db.fundiProfile.groupBy({
      by: ["category"],
      _count: { _all: true },
    })
    const countMap: Record<string, number> = {}
    for (const c of counts) countMap[c.category] = c._count._all
    return NextResponse.json({
      categories: categories.map((c: Prisma.CategoryGetPayload<{}>) => ({
        ...c,
        fundiCount: countMap[c.name] ?? 0,
      })),
    })
  } catch (err) {
    console.error("admin categories list error:", err)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const { error, user: adminUser } = await requireAdmin()
  if (error) return error

  try {
    const body = await request.json()
    const name = String(body.name ?? "").trim()
    const icon = String(body.icon ?? "").trim()
    if (!name || !icon) {
      return NextResponse.json(
        { error: "name and icon are required" },
        { status: 400 }
      )
    }
    const exists = await db.category.findUnique({ where: { name } })
    if (exists) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      )
    }
    const created = await db.category.create({ data: { name, icon } })
    await logAudit({
      action: "ADMIN_CATEGORY_CREATED",
      details: `Admin ${adminUser?.name} created category ${name}`,
      req: request,
      userId: adminUser?.id,
    })
    return NextResponse.json({ category: created }, { status: 201 })
  } catch (err) {
    console.error("admin create category error:", err)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}
