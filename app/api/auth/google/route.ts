import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  if (!clientId) {
    return NextResponse.json({ error: "Google OAuth not configured" }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const state = searchParams.get("state") || ""

  const redirectUri = `${baseUrl}/api/auth/callback/google`
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  url.searchParams.set("client_id", clientId)
  url.searchParams.set("redirect_uri", redirectUri)
  url.searchParams.set("response_type", "code")
  url.searchParams.set("scope", "openid email profile")
  url.searchParams.set("access_type", "offline")
  url.searchParams.set("prompt", "select_account")
  if (state) url.searchParams.set("state", state)

  return NextResponse.redirect(url.toString())
}
