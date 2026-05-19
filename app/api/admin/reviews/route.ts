import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const q = url.searchParams.get("q")
    const where = q
      ? {
          OR: [
            { comment: { contains: q, mode: "insensitive" } },
            { reviewerName: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined

    const reviews = await db.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { fundiProfile: true },
      take: 200,
    })

    return NextResponse.json({ reviews })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}
