import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} mins ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hours ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} days ago`
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("user_session")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { fundiProfile: true },
    })

    if (!user || !user.fundiProfile) {
      return NextResponse.json(
        { error: "Fundi profile not found" },
        { status: 404 }
      )
    }

    const fundiTrades = (user.fundiProfile.trade || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    if (fundiTrades.length === 0) {
      return NextResponse.json([])
    }

    // Fetch all clients, then filter in JS so we can handle comma-separated multi-categories
    const allClients = await db.user.findMany({
      where: {
        role: "client",
        clientProfile: { isNot: null },
      },
      include: { clientProfile: true },
    })

    const dbClients = allClients.filter((client) => {
      const clientCats = (client.clientProfile?.projectCategory || "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
      return fundiTrades.some((t) => clientCats.includes(t.toLowerCase()))
    })

    const dbLeads = dbClients.map((client) => {
      const profile = client.clientProfile!
      const location = profile.projectLocation || "Nairobi"
      return {
        id: `db-lead-${profile.id}`,
        clientName: client.name,
        trade: profile.projectCategory || fundiTrades[0],
        title: `Need a Professional ${profile.projectCategory?.split(",")[0] || fundiTrades[0]} in ${location}`,
        location,
        budget: profile.budgetRange || "Flexible",
        urgency: profile.urgency || "Flexible",
        description: `Client needs a skilled ${
          profile.projectCategory
            ?.split(",")
            .map((s: string) => s.trim())
            .join(", ") || fundiTrades.join(", ")
        } for a project in ${location}. Budget: ${profile.budgetRange || "flexible"}. Timeline: ${profile.urgency || "flexible"}.`,
        phone: client.phone,
        createdAt: formatRelativeTime(profile.updatedAt),
      }
    })

    return NextResponse.json(dbLeads)
  } catch (error) {
    console.error("Leads fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
