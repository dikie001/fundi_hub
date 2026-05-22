import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const url = new URL(request.url)
    const action = url.searchParams.get("action")
    const q = url.searchParams.get("q")?.trim()
    const take = Math.min(Number(url.searchParams.get("take") ?? 200), 1000)

    const where: Record<string, unknown> = {}
    if (action) where.action = action
    if (q) {
      where.OR = [
        { action: { contains: q, mode: "insensitive" } },
        { details: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
      ]
    }

    const logs = await db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      include: {
        user: { select: { id: true, name: true, role: true } },
      },
    })

    // Distinct actions for filter dropdown
    const distinctActions = await db.auditLog.findMany({
      distinct: ["action"],
      select: { action: true },
      orderBy: { action: "asc" },
    })

    return NextResponse.json({
      logs,
      actions: distinctActions.map((a) => a.action),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    )
  }
}
