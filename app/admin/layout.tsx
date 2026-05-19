import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const userId = cookieStore.get("user_session")?.value

  if (!userId) return redirect("/auth/login")

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user || user.role !== "admin") return redirect("/auth/login")

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-6">
        <h1 className="text-sm font-bold">Admin Dashboard</h1>
        <div className="text-xs">{user.name}</div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
    </div>
  )
}
