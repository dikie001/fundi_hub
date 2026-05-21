import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const action = url.searchParams.get("action")
    const take = Number(url.searchParams.get("take") ?? 100)

    const where = action ? { action } : undefined

    const logs = await db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
    })

    return NextResponse.json({ logs })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    )
  }
}
