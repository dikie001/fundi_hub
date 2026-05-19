import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("user_session")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        fundiProfile: true,
        clientProfile: true,
        referrals: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Hide password
    const { password, ...safeUser } = user

    return NextResponse.json({ user: safeUser }, { status: 200 })
  } catch (error) {
    console.error("Auth me error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
