import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyPassword, hashPassword } from "@/lib/auth"
import { logAudit } from "@/lib/audit"

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

    // Check if this login matches the ADMIN credentials in env
    const adminEmailEnv = process.env.ADMIN_EMAIL?.toLowerCase().trim()
    const adminPhoneEnv = process.env.ADMIN_PHONE?.replace(/[^0-9]/g, "")
    const adminPasswordEnv = process.env.ADMIN_PASSWORD

    const adminNormalizedEmailFromPhone = adminPhoneEnv
      ? `${adminPhoneEnv}@fundihub.com`
      : undefined

    const isAdminLogin =
      adminPasswordEnv &&
      (searchEmail === adminEmailEnv ||
        (adminNormalizedEmailFromPhone &&
          searchEmail === adminNormalizedEmailFromPhone))

    let user = await db.user.findUnique({ where: { email: searchEmail } })

    if (isAdminLogin && adminPasswordEnv && password === adminPasswordEnv) {
      // Upsert admin user to keep DB in sync with env
      const adminName = process.env.ADMIN_NAME ?? "Admin"
      const phone = process.env.ADMIN_PHONE ?? "0000000000"
      const emailToUse =
        adminEmailEnv ?? adminNormalizedEmailFromPhone ?? searchEmail

      user = await db.user.upsert({
        where: { email: emailToUse },
        update: {
          name: adminName,
          phone,
          password: hashPassword(adminPasswordEnv),
          role: "admin",
        },
        create: {
          name: adminName,
          email: emailToUse,
          phone,
          password: hashPassword(adminPasswordEnv),
          role: "admin",
        },
      })

      await logAudit({
        action: "ADMIN_LOGIN",
        details: `Admin ${adminName} logged in`,
        req: request,
        userId: user.id,
      })
    }

    if (!user) {
      await logAudit({
        action: "USER_LOGIN_FAILED",
        details: `Login failed for ${searchEmail}`,
        req: request,
      })
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
        await logAudit({
          action: "USER_LOGIN_FAILED",
          details: `Invalid password for ${user.email ?? user.phone}`,
          req: request,
          userId: user.id,
        })
        return NextResponse.json(
          { error: "Invalid phone number or password" },
          { status: 401 }
        )
      }
    }

    // Log successful login
    const loginAction = user.role === "admin" ? "ADMIN_LOGIN" : "USER_LOGIN"
    await logAudit({
      action: loginAction,
      details: `User ${user.email ?? user.phone} logged in`,
      req: request,
      userId: user.id,
    })

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
