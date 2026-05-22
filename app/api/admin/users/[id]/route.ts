import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { hashPassword } from "@/lib/auth"
import { logAudit } from "@/lib/audit"

export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  const user = await db.user.findUnique({
    where: { id },
    include: {
      fundiProfile: true,
      clientProfile: true,
      referrals: true,
    },
  })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  const { password, ...safe } = user
  return NextResponse.json({ user: safe })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user: adminUser } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await params
    const existing = await db.user.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const data: Record<string, unknown> = {}
    if (typeof body.name === "string" && body.name.trim())
      data.name = body.name.trim()
    if (typeof body.phone === "string" && body.phone.trim())
      data.phone = body.phone.trim()
    if (typeof body.email === "string" && body.email.trim())
      data.email = body.email.trim()
    if (
      body.role === "client" ||
      body.role === "fundi" ||
      body.role === "admin"
    ) {
      data.role = body.role
    }
    if (typeof body.password === "string" && body.password.length >= 6) {
      data.password = hashPassword(body.password)
    }

    const updated = await db.user.update({ where: { id }, data })
    await logAudit({
      action: "ADMIN_USER_UPDATED",
      details: `Admin ${adminUser?.name} updated user ${updated.name} (${id}) fields=${Object.keys(data).join(",")}`,
      req: request,
      userId: adminUser?.id,
    })
    const { password, ...safe } = updated
    return NextResponse.json({ user: safe })
  } catch (err) {
    console.error("admin update user error:", err)
    return NextResponse.json(
      { error: "Failed to update user" },
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
    if (id === adminUser?.id) {
      return NextResponse.json(
        { error: "You cannot delete your own admin account" },
        { status: 400 }
      )
    }
    const existing = await db.user.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    await db.user.delete({ where: { id } })
    await logAudit({
      action: "ADMIN_USER_DELETED",
      details: `Admin ${adminUser?.name} deleted user ${existing.name} (${id})`,
      req: request,
      userId: adminUser?.id,
    })
    return NextResponse.json({ message: "Deleted" })
  } catch (err) {
    console.error("admin delete user error:", err)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
