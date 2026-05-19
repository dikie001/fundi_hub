import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { logAudit } from "@/lib/audit"

// Helper to look up user by either user ID or name slug
async function findUserByNameOrId(nameOrId: string) {
  // 1. Try finding by ID
  let user = await db.user.findUnique({
    where: { id: nameOrId },
    include: { fundiProfile: true },
  })

  // 2. Try finding by name (case-insensitive, matching slug format)
  if (!user) {
    const decodedName = decodeURIComponent(nameOrId).replace(/-/g, " ").trim()
    user = await db.user.findFirst({
      where: {
        name: {
          equals: decodedName,
          mode: "insensitive",
        },
        role: "fundi",
      },
      include: { fundiProfile: true },
    })
  }

  return user
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ name: string }> }
) {
  try {
    const { name: nameOrId } = await props.params
    const user = await findUserByNameOrId(nameOrId)

    if (!user || !user.fundiProfile) {
      return NextResponse.json({ error: "Fundi profile not found" }, { status: 404 })
    }

    const reviews = await db.review.findMany({
      where: { fundiProfileId: user.fundiProfile.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }
  const realIp = request.headers.get("x-real-ip")
  if (realIp) {
    return realIp.trim()
  }
  return (request as any).ip || "127.0.0.1"
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ name: string }> }
) {
  try {
    const { name: nameOrId } = await props.params
    const body = await request.json()
    const { reviewerName, rating, comment } = body

    if (!reviewerName || !rating || !comment) {
      return NextResponse.json(
        { error: "Reviewer name, rating, and comment are required" },
        { status: 400 }
      )
    }

    const ratingVal = parseInt(rating, 10)
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      )
    }

    const user = await findUserByNameOrId(nameOrId)
    if (!user || !user.fundiProfile) {
      return NextResponse.json({ error: "Fundi profile not found" }, { status: 404 })
    }

    const profile = user.fundiProfile
    const ip = getClientIp(request)

    // Check if review by same IP already exists for this fundi profile
    const existingReview = await db.review.findFirst({
      where: {
        fundiProfileId: profile.id,
        ip: ip,
      },
    })

    let review
    if (existingReview) {
      if (existingReview.reviewerName.trim().toLowerCase() !== reviewerName.trim().toLowerCase()) {
        return NextResponse.json(
          { error: "You cannot change your reviewer name once a review has been submitted." },
          { status: 400 }
        )
      }
      review = await db.review.update({
        where: { id: existingReview.id },
        data: {
          reviewerName, // Keep name field consistent
          rating: ratingVal,
          comment,
          createdAt: new Date(),
        },
      })
      await logAudit({ action: "REVIEW_UPDATED", details: `Review ${existingReview.id} updated for fundi ${profile.id}`, req: request })
    } else {
      review = await db.review.create({
        data: {
          fundiProfileId: profile.id,
          reviewerName,
          rating: ratingVal,
          comment,
          ip,
        },
      })
      await logAudit({ action: "REVIEW_CREATED", details: `Review ${review.id} created for fundi ${profile.id}`, req: request })
    }

    // Fetch all reviews to recalculate profile rating
    const allReviews = await db.review.findMany({
      where: { fundiProfileId: profile.id },
    })

    const count = allReviews.length
    const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0)
    const newRating = count > 0 ? parseFloat((sum / count).toFixed(1)) : 5.0

    // Update profile with new stats
    await db.fundiProfile.update({
      where: { id: profile.id },
      data: {
        rating: newRating,
        reviews: count,
      },
    })

    return NextResponse.json(review, { status: existingReview ? 200 : 201 })
  } catch (error) {
    console.error("Error creating/updating review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
