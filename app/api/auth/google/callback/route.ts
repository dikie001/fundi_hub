import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { cookies } from "next/headers"
import crypto from "crypto"

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error || !code) {
      return NextResponse.redirect(
        `${baseUrl}/auth/login?error=google_cancelled`
      )
    }

    const clientId = process.env.GOOGLE_CLIENT_ID!
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
    const redirectUri = `${baseUrl}/api/auth/google/callback`

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) {
      return NextResponse.redirect(`${baseUrl}/auth/login?error=google_token`)
    }

    // Get user info from Google
    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    )
    const googleUser = await userInfoRes.json()

    if (!googleUser.email) {
      return NextResponse.redirect(
        `${baseUrl}/auth/login?error=google_no_email`
      )
    }

    // Find or create user
    let user = await db.user.findFirst({
      where: { email: googleUser.email },
      include: { fundiProfile: true, clientProfile: true },
    })

    if (!user) {
      // New user — create as client by default; they can switch via account settings
      const phone = googleUser.sub // use Google sub as placeholder phone
      user = await db.user.create({
        data: {
          name: googleUser.name || googleUser.email.split("@")[0],
          email: googleUser.email,
          phone: `google_${googleUser.sub}`,
          password: crypto.randomBytes(32).toString("hex"), // random, not usable for pw login
          role: "client",
          clientProfile: {
            create: {
              image: googleUser.picture || null,
            },
          },
        },
        include: { fundiProfile: true, clientProfile: true },
      })
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("user_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    })

    // Redirect to the right dashboard
    if (user.role === "fundi") {
      return NextResponse.redirect(`${baseUrl}/fundi/dashboard`)
    } else if (user.role === "admin") {
      return NextResponse.redirect(`${baseUrl}/admin/dashboard`)
    }
    return NextResponse.redirect(`${baseUrl}/client/dashboard`)
  } catch (err) {
    console.error("Google OAuth callback error:", err)
    return NextResponse.redirect(`${baseUrl}/auth/login?error=google_error`)
  }
}
