import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const resolvedParams = await params
    const decodedName = decodeURIComponent(resolvedParams.name).replace(/-/g, " ")

    const users = await db.user.findMany({
      where: {
        role: "fundi",
      },
      include: {
        fundiProfile: true,
      },
    })

    const cleanParamName = decodedName.trim().replace(/\s+/g, " ").toLowerCase()
    const user = users.find((u) => {
      const cleanDbName = u.name.trim().replace(/\s+/g, " ").toLowerCase()
      return cleanDbName === cleanParamName
    })

    if (!user) {
      return NextResponse.json({ error: "Fundi not found" }, { status: 404 })
    }

    // Hide password
    const { password, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error("Error fetching fundi by name:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
