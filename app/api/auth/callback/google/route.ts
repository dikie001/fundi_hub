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
    const stateRaw = searchParams.get("state") || ""

    // Decode state that carries pre-collected signup data
    let signupState: Record<string, string> = {}
    try {
      if (stateRaw) signupState = JSON.parse(decodeURIComponent(stateRaw))
    } catch {
      signupState = {}
    }

    if (error || !code) {
      return NextResponse.redirect(`${baseUrl}/auth/login?error=google_cancelled`)
    }

    const clientId = process.env.GOOGLE_CLIENT_ID!
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
    const redirectUri = `${baseUrl}/api/auth/callback/google`

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

    // Fetch Google profile
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const googleUser = await userInfoRes.json()

    if (!googleUser.email) {
      return NextResponse.redirect(`${baseUrl}/auth/login?error=google_no_email`)
    }

    // Find existing user by email
    let user = await db.user.findFirst({
      where: { email: googleUser.email },
      include: { fundiProfile: true, clientProfile: true },
    })

    if (!user) {
      // New user — build from state data collected during onboarding
      const userType = (signupState.userType as "client" | "fundi") || "client"
      const derivedName = googleUser.name || googleUser.email.split("@")[0]
      const uniquePhone = `g_${googleUser.sub.slice(-10)}`

      user = await db.user.create({
        data: {
          name: derivedName,
          email: googleUser.email,
          phone: uniquePhone,
          password: crypto.randomBytes(32).toString("hex"),
          role: userType === "fundi" ? "fundi" : "client",
          ...(userType === "fundi"
            ? {
                fundiProfile: {
                  create: {
                    title: `${signupState.trade?.split(",")[0] || "General"} Expert`,
                    category: signupState.trade?.split(",")[0] || "General",
                    trade: signupState.trade || "General",
                    yearsExperience: signupState.yearsExperience || "1",
                    serviceArea: signupState.serviceArea || "",
                    nationalId: signupState.nationalId || "",
                    preferredContact: (signupState.preferredContact as string) || "whatsapp",
                    premiumLevel: "none",
                    image: googleUser.picture || null,
                  },
                },
              }
            : {
                clientProfile: {
                  create: {
                    projectCategory: signupState.projectCategory || "",
                    projectLocation: signupState.projectLocation || "",
                    budgetRange: signupState.budgetRange || "",
                    urgency: signupState.urgency || "",
                    image: googleUser.picture || null,
                  },
                },
              }),
        },
        include: { fundiProfile: true, clientProfile: true },
      })
    }

    // Create session
    const cookieStore = await cookies()
    cookieStore.set("user_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    })

    if (user.role === "fundi") return NextResponse.redirect(`${baseUrl}/fundi/dashboard`)
    if (user.role === "admin") return NextResponse.redirect(`${baseUrl}/admin/dashboard`)
    return NextResponse.redirect(`${baseUrl}/client/dashboard`)
  } catch (err) {
    console.error("Google OAuth callback error:", err)
    return NextResponse.redirect(`${baseUrl}/auth/login?error=google_error`)
  }
}
