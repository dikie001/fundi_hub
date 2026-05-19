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
      return NextResponse.json({ error: "Fundi profile not found" }, { status: 404 })
    }

    const trade = user.fundiProfile.trade || ""

    // Fetch database client profiles that match the trade (projectCategory matches trade case-insensitively)
    const dbClients = await db.user.findMany({
      where: {
        role: "client",
        clientProfile: {
          projectCategory: {
            equals: trade,
            mode: "insensitive",
          },
        },
      },
      include: {
        clientProfile: true,
      },
    })

    const dbLeads = dbClients.map((client) => {
      const profile = client.clientProfile!
      const location = profile.projectLocation || "Nairobi"
      return {
        id: `db-lead-${profile.id}`,
        clientName: client.name,
        trade: profile.projectCategory || trade,
        title: `Need a Professional ${profile.projectCategory || trade} in ${location}`,
        location,
        budget: profile.budgetRange || "Flexible",
        urgency: profile.urgency || "Flexible",
        description: `Client is looking for a skilled ${profile.projectCategory || trade} for a project in ${location}. Budget range is ${profile.budgetRange || "flexible"} and required timing is ${profile.urgency || "flexible"}. Please contact for details.`,
        phone: client.phone,
        createdAt: formatRelativeTime(profile.updatedAt),
      }
    })

    return NextResponse.json(dbLeads)
  } catch (error) {
    console.error("Leads fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
