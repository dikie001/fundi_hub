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
    const status = url.searchParams.get("status") as
      | "pending"
      | "registered"
      | "paid"
      | null

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (q) {
      where.OR = [
        { refereeName: { contains: q, mode: "insensitive" } },
        { refereePhone: { contains: q, mode: "insensitive" } },
        { refereeTrade: { contains: q, mode: "insensitive" } },
        { referrer: { name: { contains: q, mode: "insensitive" } } },
      ]
    }

    const referrals = await db.referral.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        referrer: {
          select: { id: true, name: true, phone: true, role: true },
        },
      },
      take: 500,
    })

    return NextResponse.json({ referrals })
  } catch (err) {
    console.error("admin referrals list error:", err)
    return NextResponse.json(
      { error: "Failed to fetch referrals" },
      { status: 500 }
    )
  }
}
