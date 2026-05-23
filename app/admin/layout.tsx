import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { db } from "@/lib/db"
import { AdminShell } from "./components/admin-shell"
import { AdminLoader } from "@/components/admin-loader"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  let userId = cookieStore.get("user_session")?.value

  // Fallback: parse cookie header if cookies().get is not available
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

  if (!userId) return redirect("/auth/login")

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user || user.role !== "admin") return redirect("/auth/login")

  return (
    <Suspense fallback={<AdminLoader />}>
      <AdminShell userName={user.name} userPhone={user.phone}>
        {children}
      </AdminShell>
    </Suspense>
  )
}
