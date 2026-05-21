import { db } from "@/lib/db"

export default async function AdminDashboardPage() {
  const totalUsers = await db.user.count()
  const totalFundis = await db.fundiProfile.count()
  const totalClients = await db.clientProfile.count()
  const totalReviews = await db.review.count()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="text-xs font-medium text-muted-foreground">
            Total Users
          </div>
          <div className="mt-2 text-2xl font-bold">{totalUsers}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs font-medium text-muted-foreground">
            Fundis
          </div>
          <div className="mt-2 text-2xl font-bold">{totalFundis}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs font-medium text-muted-foreground">
            Clients
          </div>
          <div className="mt-2 text-2xl font-bold">{totalClients}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs font-medium text-muted-foreground">
            Reviews
          </div>
          <div className="mt-2 text-2xl font-bold">{totalReviews}</div>
        </div>
      </div>

      <section className="rounded-lg border p-4">
        <h2 className="text-sm font-bold">Recent Audit Logs</h2>
        <div className="mt-3 text-sm text-muted-foreground">
          View audit logs in the admin API.
        </div>
      </section>
    </div>
  )
}
