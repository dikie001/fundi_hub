import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { logAudit } from "@/lib/audit"

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
      googlePicture,
      googleSub,
    } = body

    // Validate basic required fields
    const missingFields = []
    if (!name) missingFields.push("name")
    if (!phone) missingFields.push("phone number")
    if (!password) missingFields.push("password")
    if (!userType) missingFields.push("user type")

    // Validate fundi-specific required fields
    if (userType === "fundi") {
      if (!trade) missingFields.push("trade/category")
      if (!preferredContact) missingFields.push("preferred contact method")
    }

    if (missingFields.length > 0) {
      const fieldsList = missingFields.join(", ")
      return NextResponse.json(
        { error: `Please provide: ${fieldsList}` },
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
        ...(googlePicture ? { image: googlePicture } : {}),
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
                  isPremium: false,
                  ...(googlePicture ? { image: googlePicture } : {}),
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
                  ...(googlePicture ? { image: googlePicture } : {}),
                },
              },
            }),
      },
    })

    if (userType === "fundi" && referrerId) {
      try {
        const referrer = await db.user.findUnique({
          where: { id: referrerId },
        })
        if (referrer) {
          await db.referral.create({
            data: {
              referrerId,
              refereeName: name,
              refereePhone: phone,
              refereeTrade: trade || "General",
              status: "registered",
              commission: 100.0,
            },
          })
        }
      } catch (err) {
        console.error("Error creating referral record:", err)
      }
    }

    // Audit the registration
    await logAudit({
      action: "USER_REGISTRATION",
      details: `User ${name} registered as ${userType}`,
      req: request,
      userId: user.id,
    })

    // If this was a Google signup, set a session cookie so the user is logged in
    if (googleSub) {
      const response = NextResponse.json(
        {
          message: "Registration successful",
          userId: user.id,
          role: user.role,
        },
        { status: 201 }
      )
      response.cookies.set("user_session", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
      return response
    }

    return NextResponse.json(
      { message: "Registration successful", userId: user.id, role: user.role },
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
