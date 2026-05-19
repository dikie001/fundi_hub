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

    // Simulated fallback mock leads to ensure a populated dashboard
    const mockLeads = [
      {
        id: "mock-lead-1",
        clientName: "David K.",
        trade: "Plumber",
        title: "Urgent Kitchen Pipe Leak",
        location: "Nairobi, Kilimani",
        budget: "KES 3,500",
        urgency: "Today / Immediate",
        description: "Our kitchen sink pipe has burst and water is flooding the floor. Need a plumber right away.",
        phone: "+254 712 345 678",
        createdAt: "10 mins ago"
      },
      {
        id: "mock-lead-2",
        clientName: "Grace M.",
        trade: "Electrician",
        title: "Short Circuit in Living Room",
        location: "Nairobi, Langata",
        budget: "KES 5,000",
        urgency: "Within 3 Days",
        description: "Several sockets have stopped working after a spark. Need an electrician to trace the fault.",
        phone: "+254 722 890 123",
        createdAt: "45 mins ago"
      },
      {
        id: "mock-lead-3",
        clientName: "John O.",
        trade: "Painter",
        title: "Apartment Interior Painting",
        location: "Mombasa, Nyali",
        budget: "KES 25,000",
        urgency: "Flexible / Planning",
        description: "Looking to repaint the interior of a 2-bedroom apartment next week. Budget is flexible.",
        phone: "+254 733 456 789",
        createdAt: "2 hours ago"
      },
      {
        id: "mock-lead-4",
        clientName: "Carpenter",
        trade: "Carpenter",
        title: "Fix Wardrobe Hinges",
        location: "Nairobi, Westlands",
        budget: "KES 2,000",
        urgency: "Within a Week",
        description: "Two sliding wardrobe doors have come off their hinges and need realignment.",
        phone: "+254 701 234 567",
        createdAt: "4 hours ago"
      },
      {
        id: "mock-lead-5",
        clientName: "Peter K.",
        trade: "Plumber",
        title: "Install Instant Shower Heater",
        location: "Nairobi, Kasarani",
        budget: "KES 1,500",
        urgency: "Within 3 Days",
        description: "Looking for an experienced plumber to mount and connect a brand new instant heater in bathroom.",
        phone: "+254 711 999 888",
        createdAt: "1 day ago"
      }
    ]

    // Filter mock leads that match the trade
    const filteredMockLeads = mockLeads.filter(
      (lead) => lead.trade.toLowerCase() === trade.toLowerCase()
    )

    // Combine database leads first, then fallback/append mock leads
    const combinedLeads = [...dbLeads, ...filteredMockLeads]

    return NextResponse.json(combinedLeads)
  } catch (error) {
    console.error("Leads fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
