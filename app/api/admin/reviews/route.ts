import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const url = new URL(request.url)
    const q = url.searchParams.get("q")
    const searchMode: Prisma.QueryMode = "insensitive"
    const where: Prisma.ReviewWhereInput | undefined = q
      ? {
          OR: [
            { comment: { contains: q, mode: searchMode } },
            { reviewerName: { contains: q, mode: searchMode } },
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
