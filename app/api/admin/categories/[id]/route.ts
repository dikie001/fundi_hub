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
    const existing = await db.category.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    const body = await request.json()
    const data: Record<string, unknown> = {}
    if (typeof body.name === "string" && body.name.trim())
      data.name = body.name.trim()
    if (typeof body.icon === "string" && body.icon.trim())
      data.icon = body.icon.trim()

    const updated = await db.category.update({ where: { id }, data })
    await logAudit({
      action: "ADMIN_CATEGORY_UPDATED",
      details: `Admin ${adminUser?.name} updated category ${updated.name}`,
      req: request,
      userId: adminUser?.id,
    })
    return NextResponse.json({ category: updated })
  } catch (err) {
    console.error("admin update category error:", err)
    return NextResponse.json(
      { error: "Failed to update category" },
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
    const existing = await db.category.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    await db.category.delete({ where: { id } })
    await logAudit({
      action: "ADMIN_CATEGORY_DELETED",
      details: `Admin ${adminUser?.name} deleted category ${existing.name}`,
      req: request,
      userId: adminUser?.id,
    })
    return NextResponse.json({ message: "Deleted" })
  } catch (err) {
    console.error("admin delete category error:", err)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}
