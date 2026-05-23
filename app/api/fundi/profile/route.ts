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
      title,
      trade,
      yearsExperience,
      serviceArea,
      description,
      isAvailable,
      preferredContact,
      premiumLevel,
      image,
      skills,
      portfolio,
    } = body

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { fundiProfile: true },
    })

    if (!user || user.role !== "fundi") {
      return NextResponse.json(
        { error: "Fundi profile not found" },
        { status: 404 }
      )
    }

    if (name) {
      await db.user.update({
        where: { id: userId },
        data: { name },
      })
    }

    const updatedProfile = await db.fundiProfile.update({
      where: { userId },
      data: {
        title: title !== undefined ? title : user.fundiProfile?.title,
        trade: trade !== undefined ? trade : user.fundiProfile?.trade,
        yearsExperience:
          yearsExperience !== undefined
            ? yearsExperience
            : user.fundiProfile?.yearsExperience,
        serviceArea:
          serviceArea !== undefined
            ? serviceArea
            : user.fundiProfile?.serviceArea,
        description:
          description !== undefined
            ? description
            : user.fundiProfile?.description,
        isAvailable:
          isAvailable !== undefined
            ? isAvailable
            : user.fundiProfile?.isAvailable,
        preferredContact:
          preferredContact !== undefined
            ? preferredContact
            : user.fundiProfile?.preferredContact,
        premiumLevel:
          premiumLevel !== undefined
            ? premiumLevel
            : user.fundiProfile?.premiumLevel,
        image: image !== undefined ? image : user.fundiProfile?.image,
        skills: skills !== undefined ? skills : user.fundiProfile?.skills,
        portfolio:
          portfolio !== undefined ? portfolio : user.fundiProfile?.portfolio,
      },
    })

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
