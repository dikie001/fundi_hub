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
    const premium = url.searchParams.get("premium")

    const where: Record<string, unknown> = {}
    if (premium && ["none", "verified", "top"].includes(premium)) {
      where.premiumLevel = premium
    }
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
        { serviceArea: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
      ]
    }

    const profiles = await db.fundiProfile.findMany({
      where,
      orderBy: [{ premiumLevel: "desc" }, { rating: "desc" }],
      include: {
        user: { select: { id: true, name: true, phone: true, email: true } },
      },
      take: 500,
    })

    return NextResponse.json({ fundis: profiles })
  } catch (err) {
    console.error("admin fundis list error:", err)
    return NextResponse.json(
      { error: "Failed to fetch fundis" },
      { status: 500 }
    )
  }
}
