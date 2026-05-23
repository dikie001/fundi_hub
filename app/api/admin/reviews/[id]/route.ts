import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { logAudit } from "@/lib/audit"
import { requireAdmin } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user: adminUser } = await requireAdmin()
  if (error) return error
  try {
    const { id } = await params
    const existing = await db.review.findUnique({ where: { id } })
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 })

    await db.review.delete({ where: { id } })

    // Recalculate fundi rating
    const fundiId = existing.fundiProfileId
    const reviews = await db.review.findMany({
      where: { fundiProfileId: fundiId },
    })
    type ReviewRow = Awaited<ReturnType<typeof db.review.findMany>>[number]
    const count = reviews.length
    const avg =
      count > 0
        ? reviews.reduce((sum: number, review: ReviewRow) => sum + review.rating, 0) / count
        : 5.0

    await db.fundiProfile.update({
      where: { id: fundiId },
      data: { rating: avg, reviews: count },
    })

    await logAudit({
      action: "ADMIN_REVIEW_DELETED",
      details: `Admin ${adminUser?.name} deleted review ${id} for fundi ${fundiId}`,
      req: request,
      userId: adminUser?.id,
    })

    return NextResponse.json({ message: "Deleted" })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    )
  }
}
