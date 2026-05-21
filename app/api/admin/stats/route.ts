import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const totalUsers = await db.user.count()
    const totalFundis = await db.fundiProfile.count()
    const totalClients = await db.clientProfile.count()
    const totalReviews = await db.review.count()

    return NextResponse.json({
      totalUsers,
      totalFundis,
      totalClients,
      totalReviews,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
