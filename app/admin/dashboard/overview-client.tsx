"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Users,
  Wrench,
  UserCheck,
  Star,
  Tags,
  Gift,
  ScrollText,
  TrendingUp,
  DollarSign,
  Briefcase,
  Loader2,
} from "lucide-react"
import { StatCard } from "../components/stat-card"

interface Stats {
  totals: {
    users: number
    fundis: number
    clients: number
    reviews: number
    categories: number
    referrals: number
    auditLogs: number
    avgRating: number
    jobsCompleted: number
    totalEarnings: number
  }
  premiumBreakdown: { level: string; count: number }[]
  referralBreakdown: { status: string; count: number }[]
  topCategories: { category: string; count: number }[]
  signupsTrend: {
    week: string
    client: number
    fundi: number
    admin: number
  }[]
  reviewsTrend: { day: string; count: number; avgRating: number }[]
  recentUsers: {
    id: string
    name: string
    phone: string
    role: string
    createdAt: string
  }[]
  recentReviews: {
    id: string
    reviewerName: string
    rating: number
    comment: string
    createdAt: string
    fundiProfile?: {
      id: string
      title: string
      user?: { name: string }
    }
  }[]
  recentAudit: {
    id: string
    action: string
    details: string
    createdAt: string
  }[]
  topFundis: {
    id: string
    name: string
    phone: string
    title: string
    rating: number
    reviews: number
    jobsCompleted: number
    isPremium: boolean
  }[]
}

const PIE_COLORS = ["#f97316", "#10b981", "#3b82f6", "#a855f7", "#ef4444"]

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })
  } catch {
    return d
  }
}

function formatCurrency(n: number) {
  return `KES ${Math.round(n).toLocaleString()}`
}

export function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/admin/stats", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d) => {
        if (!cancelled) setStats(d)
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load dashboard data")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }
  if (error || !stats) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        {error ?? "No data available."}
      </div>
    )
  }

  const t = stats.totals
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 shadow-lg">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl font-bold tracking-tight">
            Super Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete platform oversight and management control
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={t.users.toLocaleString()}
          icon={Users}
          accent="primary"
        />
        <StatCard
          label="Fundis"
          value={t.fundis.toLocaleString()}
          icon={Wrench}
          accent="emerald"
          hint={`${t.fundis ? Math.round((t.fundis / Math.max(1, t.users)) * 100) : 0}% of users`}
        />
        <StatCard
          label="Clients"
          value={t.clients.toLocaleString()}
          icon={UserCheck}
          accent="blue"
        />
        <StatCard
          label="Reviews"
          value={t.reviews.toLocaleString()}
          icon={Star}
          accent="amber"
          hint={`Avg rating ${t.avgRating.toFixed(2)}`}
        />
        <StatCard
          label="Categories"
          value={t.categories.toLocaleString()}
          icon={Tags}
          accent="violet"
        />
        <StatCard
          label="Referrals"
          value={t.referrals.toLocaleString()}
          icon={Gift}
          accent="rose"
        />
        <StatCard
          label="Audit Logs"
          value={t.auditLogs.toLocaleString()}
          icon={ScrollText}
          accent="slate"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-4 shadow-sm lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold">Signups – last 12 weeks</h2>
              <p className="text-[11px] text-muted-foreground">
                Weekly registrations grouped by role
              </p>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.signupsTrend}
                margin={{ left: 0, right: 0 }}
              >
                <defs>
                  <linearGradient id="cli" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fun" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 10 }}
                  tickFormatter={formatDate}
                />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                  }}
                  labelFormatter={(l) => formatDate(String(l))}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area
                  type="monotone"
                  dataKey="client"
                  stroke="#3b82f6"
                  fill="url(#cli)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="fundi"
                  stroke="#10b981"
                  fill="url(#fun)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-4 shadow-sm">
          <div className="mb-3">
            <h2 className="text-sm font-bold">Membership Tiers</h2>
            <p className="text-[11px] text-muted-foreground">
              Distribution across subscription levels
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.premiumBreakdown}
                  dataKey="count"
                  nameKey="level"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ payload }) => {
                    const labels = {
                      none: "Free",
                      verified: "Verified",
                      top: "Premium",
                    }
                    const level = (
                      payload as { level?: keyof typeof labels } | undefined
                    )?.level
                    return (level && labels[level]) || level || ""
                  }}
                  labelLine={false}
                >
                  {stats.premiumBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Reviews & categories charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-4 shadow-sm">
          <div className="mb-3">
            <h2 className="text-sm font-bold">Reviews – last 30 days</h2>
            <p className="text-[11px] text-muted-foreground">
              Daily review count
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.reviewsTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10 }}
                  tickFormatter={formatDate}
                />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  labelFormatter={(l) => formatDate(String(l))}
                />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-4 shadow-sm">
          <div className="mb-3">
            <h2 className="text-sm font-bold">Top Skills</h2>
            <p className="text-[11px] text-muted-foreground">
              Most popular fundi expertise areas
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.topCategories}
                layout="vertical"
                margin={{ left: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  allowDecimals={false}
                />
                <YAxis
                  dataKey="category"
                  type="category"
                  tick={{ fontSize: 10 }}
                  width={80}
                />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/50 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 p-4">
            <h2 className="text-sm font-bold">Recent signups</h2>
            <Link
              href="/admin/dashboard/users"
              className="text-[11px] font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-muted/40 text-[10px] text-muted-foreground uppercase">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((u) => (
                <tr key={u.id} className="border-t border-border/40">
                  <td className="p-3">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {u.phone}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] capitalize">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {formatDate(u.createdAt)}
                  </td>
                </tr>
              ))}
              {stats.recentUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/50 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 p-4">
            <h2 className="text-sm font-bold">Top-rated fundis</h2>
            <Link
              href="/admin/dashboard/fundis"
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Manage
            </Link>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-muted/40 text-[10px] text-muted-foreground uppercase">
              <tr>
                <th className="p-3 text-left">Fundi</th>
                <th className="p-3 text-left">Rating</th>
                <th className="p-3 text-left">Jobs</th>
                <th className="p-3 text-left">Tier</th>
              </tr>
            </thead>
            <tbody>
              {stats.topFundis.map((f) => (
                <tr key={f.id} className="border-t border-border/40">
                  <td className="p-3">
                    <div className="font-medium">{f.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {f.title}
                    </div>
                  </td>
                  <td className="p-3">
                    {f.rating.toFixed(1)} ★ ({f.reviews})
                  </td>
                  <td className="p-3">{f.jobsCompleted}</td>
                  <td className="p-3">
                    {f.isPremium ? "Premium" : "Standard"}
                  </td>
                </tr>
              ))}
              {stats.topFundis.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No fundis yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/50 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 p-4">
            <h2 className="text-sm font-bold">Recent reviews</h2>
            <Link
              href="/admin/dashboard/reviews"
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Moderate
            </Link>
          </div>
          <ul className="divide-y divide-border/40">
            {stats.recentReviews.map((r) => (
              <li key={r.id} className="p-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.reviewerName}</div>
                  <div className="text-amber-500">
                    {"★".repeat(r.rating)}
                    <span className="text-muted-foreground">
                      {"★".repeat(5 - r.rating)}
                    </span>
                  </div>
                </div>
                <div className="mt-1 text-muted-foreground">
                  On{" "}
                  <span className="font-medium text-foreground">
                    {r.fundiProfile?.user?.name ?? "Unknown"}
                  </span>{" "}
                  · {formatDate(r.createdAt)}
                </div>
                <p className="mt-2 line-clamp-2 text-foreground/80">
                  {r.comment}
                </p>
              </li>
            ))}
            {stats.recentReviews.length === 0 && (
              <li className="p-6 text-center text-xs text-muted-foreground">
                No reviews yet.
              </li>
            )}
          </ul>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/50 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 p-4">
            <div className="flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-bold">Recent activity</h2>
            </div>
            <Link
              href="/admin/dashboard/audit-logs"
              className="text-[11px] font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border/40">
            {stats.recentAudit.map((a) => (
              <li key={a.id} className="p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {a.action}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDate(a.createdAt)}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-muted-foreground">
                  {a.details}
                </p>
              </li>
            ))}
            {stats.recentAudit.length === 0 && (
              <li className="p-6 text-center text-xs text-muted-foreground">
                No activity yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
