import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const auditLog = db.auditLog

  try {
    const [
      totalUsers,
      totalFundis,
      totalClients,
      totalReviews,
      totalCategories,
      totalReferrals,
      totalAuditLogs,
      premiumCounts,
      avgRatingAgg,
      jobsAgg,
      earningsAgg,
      referralStatusGroup,
      recentUsers,
      recentReviews,
      recentAudit,
      topFundis,
    ] = await Promise.all([
      db.user.count(),
      db.fundiProfile.count(),
      db.clientProfile.count(),
      db.review.count(),
      db.category.count(),
      db.referral.count(),
      auditLog ? auditLog.count().catch(() => 0) : Promise.resolve(0),
      db.fundiProfile.groupBy({
        by: ["premiumLevel"],
        _count: { _all: true },
      }),
      db.fundiProfile.aggregate({ _avg: { rating: true } }),
      db.fundiProfile.aggregate({ _sum: { jobsCompleted: true } }),
      db.fundiProfile.aggregate({ _sum: { jobEarnings: true } }),
      db.referral.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      db.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      }),
      db.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          fundiProfile: {
            select: {
              id: true,
              title: true,
              user: { select: { name: true } },
            },
          },
        },
      }),
      auditLog
        ? auditLog
            .findMany({ orderBy: { createdAt: "desc" }, take: 8 })
            .catch(() => [])
        : Promise.resolve([]),
      db.fundiProfile.findMany({
        orderBy: [{ rating: "desc" }, { reviews: "desc" }],
        take: 5,
        include: { user: { select: { id: true, name: true, phone: true } } },
      }),
    ])

    // Build a 12-week trend of user signups, grouped by role
    const since = new Date()
    since.setDate(since.getDate() - 12 * 7)
    const recentUserRows = await db.user.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, role: true },
    })

    const buckets: Record<
      string,
      { week: string; client: number; fundi: number; admin: number }
    > = {}
    for (let i = 11; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i * 7)
      const key = d.toISOString().slice(0, 10)
      buckets[key] = { week: key, client: 0, fundi: 0, admin: 0 }
    }
    const weekKeys = Object.keys(buckets)
    for (const row of recentUserRows) {
      const created = row.createdAt.getTime()
      let target = weekKeys[0]
      for (const k of weekKeys) {
        if (new Date(k).getTime() <= created) target = k
      }
      const b = buckets[target]
      if (
        b &&
        (row.role === "client" || row.role === "fundi" || row.role === "admin")
      ) {
        b[row.role] += 1
      }
    }
    const signupsTrend = Object.values(buckets)

    // Reviews per day for last 30 days
    const since30 = new Date()
    since30.setDate(since30.getDate() - 29)
    const recentReviewRows = await db.review.findMany({
      where: { createdAt: { gte: since30 } },
      select: { createdAt: true, rating: true },
    })
    const dayBuckets: Record<
      string,
      { day: string; count: number; _sum: number }
    > = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      dayBuckets[key] = { day: key, count: 0, _sum: 0 }
    }
    for (const r of recentReviewRows) {
      const key = r.createdAt.toISOString().slice(0, 10)
      if (dayBuckets[key]) {
        dayBuckets[key].count += 1
        dayBuckets[key]._sum += r.rating
      }
    }
    const reviewsTrend = Object.values(dayBuckets).map((b) => ({
      day: b.day,
      count: b.count,
      avgRating: b.count ? +(b._sum / b.count).toFixed(2) : 0,
    }))

    // Parse comma-separated skills from all fundis
    const allFundis = await db.fundiProfile.findMany({
      select: { skills: true },
    })
    const skillCounts: Record<string, number> = {}
    for (const fundi of allFundis) {
      if (fundi.skills) {
        const skills = fundi.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
        for (const skill of skills) {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1
        }
      }
    }
    const topCategories = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill, count]) => ({ category: skill, count }))

    return NextResponse.json({
      totals: {
        users: totalUsers,
        fundis: totalFundis,
        clients: totalClients,
        reviews: totalReviews,
        categories: totalCategories,
        referrals: totalReferrals,
        auditLogs: totalAuditLogs,
        avgRating: avgRatingAgg._avg.rating ?? 0,
        jobsCompleted: jobsAgg._sum.jobsCompleted ?? 0,
        totalEarnings: earningsAgg._sum.jobEarnings ?? 0,
      },
      premiumBreakdown: premiumCounts.map((p) => ({
        level: p.premiumLevel,
        count: p._count._all,
      })),
      referralBreakdown: referralStatusGroup.map((r) => ({
        status: r.status,
        count: r._count._all,
      })),
      topCategories,
      signupsTrend,
      reviewsTrend,
      recentUsers,
      recentReviews,
      recentAudit,
      topFundis: topFundis.map((f) => ({
        id: f.user.id,
        name: f.user.name,
        phone: f.user.phone,
        title: f.title,
        rating: f.rating,
        reviews: f.reviews,
        jobsCompleted: f.jobsCompleted,
        premiumLevel: f.premiumLevel,
      })),
    })
  } catch (err) {
    console.error("admin stats error:", err)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
