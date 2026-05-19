import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { logAudit } from "@/lib/audit"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const existing = await db.review.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    await db.review.delete({ where: { id } })

    // Recalculate fundi rating
    const fundiId = existing.fundiProfileId
    const reviews = await db.review.findMany({ where: { fundiProfileId: fundiId } })
    const count = reviews.length
    const avg = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 5.0

    await db.fundiProfile.update({ where: { id: fundiId }, data: { rating: avg, reviews: count } })

    await logAudit({ action: "REVIEW_DELETED", details: `Review ${id} deleted`, req: request })

    return NextResponse.json({ message: "Deleted" })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}
