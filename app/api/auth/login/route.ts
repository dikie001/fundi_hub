import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Phone number and password are required" },
        { status: 400 }
      )
    }

    let searchEmail = email.toLowerCase().trim()
    if (!searchEmail.includes("@")) {
      const cleanPhone = searchEmail.replace(/[^0-9]/g, "")
      searchEmail = `${cleanPhone}@fundihub.com`
    }

    const user = await db.user.findUnique({
      where: { email: searchEmail },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid phone number or password" },
        { status: 401 }
      )
    }

    const isValid = verifyPassword(password, user.password)
    if (!isValid) {
      // Fallback check: if plaintext matches (e.g. seeded data like "password123")
      if (password === user.password) {
        // Plaintext seeded user is valid
      } else {
        return NextResponse.json(
          { error: "Invalid phone number or password" },
          { status: 401 }
        )
      }
    }

    // Set simple mock cookie or session
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    )

    // Store user ID in a cookie for basic session persistence
    response.cookies.set("user_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
