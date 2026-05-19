import { NextResponse } from "next/server"
import { getFundis } from "@/lib/db/actions"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const fundis = await getFundis()
    return NextResponse.json(fundis)
  } catch (error) {
    console.error("API error fetching fundis:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
