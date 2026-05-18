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
    } = body

    if (!email || !password || !name || !phone || !userType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      )
    }

    const hashedPassword = hashPassword(password)

    // Create user and associated profile
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
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
