import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      userType,
      name,
      email,
      phone,
      password,
      trade,
      yearsExperience,
      serviceArea,
      nationalId,
      preferredContact,
      projectCategory,
      projectLocation,
      budgetRange,
      urgency,
      referrerId,
    } = body

    if (!password || !name || !phone || !userType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    // Check if phone already exists
    const existingUser = await db.user.findFirst({
      where: { phone: phone },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Phone number is already registered" },
        { status: 400 }
      )
    }

    const hashedPassword = hashPassword(password)

    // Create user and associated profile
    const user = await db.user.create({
      data: {
      name,
      ...(email ? { email: String(email).toLowerCase() } : {}),
      phone,
      password: hashedPassword,
        role: userType === "fundi" ? "fundi" : "client",
        ...(userType === "fundi"
          ? {
              fundiProfile: {
                create: {
                  title: `${trade} Expert`,
                  category: trade,
                  trade,
                  yearsExperience: yearsExperience || "1",
                  serviceArea: serviceArea || "",
                  nationalId: nationalId || "",
                  preferredContact: preferredContact || "whatsapp",
                  premiumLevel: "none",
                },
              },
            }
          : {
              clientProfile: {
                create: {
                  projectCategory: projectCategory || "",
                  projectLocation: projectLocation || "",
                  budgetRange: budgetRange || "",
                  urgency: urgency || "",
                },
              },
            }),
      },
    })

    if (userType === "fundi" && referrerId) {
      try {
        const referrer = await db.user.findUnique({
          where: { id: referrerId }
        })
        if (referrer) {
          await db.referral.create({
            data: {
              referrerId,
              refereeName: name,
              refereePhone: phone,
              refereeTrade: trade || "General",
              status: "registered",
              commission: 100.0
            }
          })
        }
      } catch (err) {
        console.error("Error creating referral record:", err)
      }
    }

    return NextResponse.json(
      { message: "Registration successful", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
