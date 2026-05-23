import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "./db"

/**
 * Reads the current user session cookie and confirms the user is an admin.
 * Returns the admin user record or a NextResponse error to short-circuit the handler.
 */
export async function requireAdmin() {
  const cookieStore = await cookies()
  let userId = cookieStore.get("user_session")?.value

  if (!userId) {
    const headerStore = await headers()
    const cookieHeader = headerStore.get("cookie") || ""
    const match = cookieHeader
      .split(";")
      .map((s) => s.trim())
      .find((c) => c.startsWith("user_session="))
    if (match) {
      userId = decodeURIComponent(match.split("=")[1] || "")
    }
  }

  if (!userId) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
    }
  }

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user || user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      user: null,
    }
  }

  return { error: null, user }
}
