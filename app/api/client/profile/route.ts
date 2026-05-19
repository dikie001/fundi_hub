import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("user_session")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      projectCategory,
      projectLocation,
      budgetRange,
      urgency,
    } = body

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { clientProfile: true },
    })

    if (!user || user.role !== "client") {
      return NextResponse.json({ error: "Client profile not found" }, { status: 404 })
    }

    if (name) {
      await db.user.update({
        where: { id: userId },
        data: { name },
      })
    }

    const updatedProfile = await db.clientProfile.update({
      where: { userId },
      data: {
        projectCategory: projectCategory !== undefined ? projectCategory : user.clientProfile?.projectCategory,
        projectLocation: projectLocation !== undefined ? projectLocation : user.clientProfile?.projectLocation,
        budgetRange: budgetRange !== undefined ? budgetRange : user.clientProfile?.budgetRange,
        urgency: urgency !== undefined ? urgency : user.clientProfile?.urgency,
      },
    })

    return NextResponse.json({
      message: "Client profile updated successfully",
      profile: updatedProfile,
    })
  } catch (error) {
    console.error("Client profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
