import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { logAudit } from "@/lib/audit"

export const dynamic = "force-dynamic"

const ALLOWED_FIELDS = [
  "title",
  "category",
  "trade",
  "yearsExperience",
  "serviceArea",
  "description",
  "skills",
  "preferredContact",
  "premiumLevel",
  "isEmergency",
  "isNearby",
  "rating",
  "reviews",
  "jobsCompleted",
  "successRate",
  "jobEarnings",
  "image",
] as const

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user: adminUser } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await params
    const existing = await db.fundiProfile.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Fundi profile not found" },
        { status: 404 }
      )
    }
    const body = await request.json()
    const data: Record<string, unknown> = {}
    for (const key of ALLOWED_FIELDS) {
      if (key in body && body[key] !== undefined) {
        data[key] = body[key]
      }
    }
    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No changes provided" },
        { status: 400 }
      )
    }
    const updated = await db.fundiProfile.update({ where: { id }, data })
    await logAudit({
      action: "ADMIN_FUNDI_UPDATED",
      details: `Admin ${adminUser?.name} updated fundi profile ${id} fields=${Object.keys(data).join(",")}`,
      req: request,
      userId: adminUser?.id,
    })
    return NextResponse.json({ fundi: updated })
  } catch (err) {
    console.error("admin update fundi error:", err)
    return NextResponse.json(
      { error: "Failed to update fundi" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user: adminUser } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await params
    const existing = await db.fundiProfile.findUnique({
      where: { id },
      include: { user: true },
    })
    if (!existing) {
      return NextResponse.json(
        { error: "Fundi profile not found" },
        { status: 404 }
      )
    }
    await db.fundiProfile.delete({ where: { id } })
    await logAudit({
      action: "ADMIN_FUNDI_PROFILE_DELETED",
      details: `Admin ${adminUser?.name} removed fundi profile for ${existing.user.name} (user ${existing.userId})`,
      req: request,
      userId: adminUser?.id,
    })
    return NextResponse.json({ message: "Deleted" })
  } catch (err) {
    console.error("admin delete fundi error:", err)
    return NextResponse.json(
      { error: "Failed to delete fundi" },
      { status: 500 }
    )
  }
}
