import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const tempData = cookieStore.get("google_signup_temp")
    
    if (!tempData) {
      return NextResponse.json({ error: "No temp data" }, { status: 404 })
    }

    const data = JSON.parse(tempData.value)
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "Invalid temp data" }, { status: 400 })
  }
}
