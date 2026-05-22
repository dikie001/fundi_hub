import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const url = new URL(request.url)
    const q = url.searchParams.get("q")?.trim()
    const where: Record<string, unknown> = {}
    if (q) {
      where.OR = [
        { projectCategory: { contains: q, mode: "insensitive" } },
        { projectLocation: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
        { user: { phone: { contains: q, mode: "insensitive" } } },
      ]
    }

    const clients = await db.clientProfile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            createdAt: true,
          },
        },
      },
      take: 500,
    })

    return NextResponse.json({ clients })
  } catch (err) {
    console.error("admin clients list error:", err)
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    )
  }
}
