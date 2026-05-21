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
      phone,
      image,
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
      return NextResponse.json(
        { error: "Client profile not found" },
        { status: 404 }
      )
    }

    // Update user-level fields (name, phone)
    const userUpdateData: Record<string, string> = {}
    if (name) userUpdateData.name = name
    if (phone) userUpdateData.phone = phone
    if (Object.keys(userUpdateData).length > 0) {
      await db.user.update({ where: { id: userId }, data: userUpdateData })
    }

    // Build profile update payload — only include keys that were provided
    const profileData: Record<string, string | null> = {}
    if (projectCategory !== undefined)
      profileData.projectCategory = projectCategory
    if (projectLocation !== undefined)
      profileData.projectLocation = projectLocation
    if (budgetRange !== undefined) profileData.budgetRange = budgetRange
    if (urgency !== undefined) profileData.urgency = urgency
    if (image !== undefined) profileData.image = image

    const updatedProfile = await db.clientProfile.update({
      where: { userId },
      data: profileData,
    })

    return NextResponse.json({
      message: "Client profile updated successfully",
      profile: updatedProfile,
    })
  } catch (error) {
    console.error("Client profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
