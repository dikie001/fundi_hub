import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { logAudit } from "@/lib/audit"

export const dynamic = "force-dynamic"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user: adminUser } = await requireAdmin()
  if (error) return error
  try {
    const { id } = await params
    const existing = await db.referral.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    const body = await request.json()
    const data: Record<string, unknown> = {}
    if (
      body.status === "pending" ||
      body.status === "registered" ||
      body.status === "paid"
    ) {
      data.status = body.status
    }
    if (typeof body.commission === "number" && body.commission >= 0) {
      data.commission = body.commission
    }
    if (typeof body.refereeName === "string" && body.refereeName.trim())
      data.refereeName = body.refereeName.trim()
    if (typeof body.refereePhone === "string" && body.refereePhone.trim())
      data.refereePhone = body.refereePhone.trim()
    if (typeof body.refereeTrade === "string" && body.refereeTrade.trim())
      data.refereeTrade = body.refereeTrade.trim()

    const updated = await db.referral.update({ where: { id }, data })
    await logAudit({
      action: "ADMIN_REFERRAL_UPDATED",
      details: `Admin ${adminUser?.name} updated referral ${id} fields=${Object.keys(data).join(",")}`,
      req: request,
      userId: adminUser?.id,
    })
    return NextResponse.json({ referral: updated })
  } catch (err) {
    console.error("admin update referral error:", err)
    return NextResponse.json(
      { error: "Failed to update referral" },
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
    const existing = await db.referral.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    await db.referral.delete({ where: { id } })
    await logAudit({
      action: "ADMIN_REFERRAL_DELETED",
      details: `Admin ${adminUser?.name} deleted referral ${id}`,
      req: request,
      userId: adminUser?.id,
    })
    return NextResponse.json({ message: "Deleted" })
  } catch (err) {
    console.error("admin delete referral error:", err)
    return NextResponse.json(
      { error: "Failed to delete referral" },
      { status: 500 }
    )
  }
}
