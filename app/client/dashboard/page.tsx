"use client"

import { useDashboard } from "./context/DashboardContext"
import Link from "next/link"
import {
  Briefcase,
  MapPin,
  DollarSign,
  Wrench,
  Star,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ClientDashboard() {
  const { user, profile, matchedFundis } = useDashboard()

  const fields = [
    profile?.projectCategory,
    profile?.projectLocation,
    profile?.budgetRange,
    profile?.urgency,
    user?.name,
    user?.phone,
  ]
  const completeness = Math.round(
    (fields.filter(Boolean).length / fields.length) * 100
  )
  const topFundis = matchedFundis.slice(0, 3)

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Banner */}
      <div className="rounded-xl border border-border/50 bg-linear-to-br from-primary/5 via-background to-background p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Habari, {user?.name?.split(" ")[0] || "Client"}! 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile?.projectCategory
                ? `You're looking for a ${profile.projectCategory} in ${profile.projectLocation || "your area"}.`
                : "Complete your project details to get matched with the best fundis."}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href="/client/dashboard/find-fundis">
                <Search className="mr-1.5 h-4 w-4" /> Browse Fundis
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/client/dashboard/my-project">
                <Briefcase className="mr-1.5 h-4 w-4" /> My Project
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {completeness < 100 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Complete your project profile to get better fundi matches
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Fill in your project category, location, budget, and urgency for
              accurate results.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            asChild
            className="h-7 shrink-0 border-amber-500/30 text-xs"
          >
            <Link href="/client/dashboard/my-project">Complete Now</Link>
          </Button>
        </div>
      )}

      {/* Matched Fundis Preview */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
            <Wrench className="h-4 w-4 text-primary" /> Your Matched Experts
          </h2>
          {matchedFundis.length > 3 && (
            <Button size="sm" variant="ghost" asChild className="gap-1 text-xs">
              <Link href="/client/dashboard/find-fundis">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>

        {topFundis.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topFundis.map((fundi) => (
              <Card
                key={fundi.id}
                className="border-border/80 bg-card transition-colors hover:border-primary/40"
              >
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start gap-3">
                    {fundi.image ? (
                      <img
                        src={fundi.image}
                        alt={fundi.name}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary uppercase">
                        {fundi.name?.slice(0, 2) || "FU"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-foreground">
                        {fundi.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {fundi.title}
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold">
                          {fundi.rating?.toFixed(1)}
                        </span>
                        {fundi.verified && (
                          <ShieldCheck className="ml-1 h-3 w-3 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    {fundi.phone && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="h-8 flex-1 text-xs"
                        >
                          <a href={`tel:${fundi.phone}`}>
                            <Phone className="mr-1 h-3 w-3" /> Call
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          asChild
                          className="h-8 flex-1 text-xs"
                        >
                          <a
                            href={`https://wa.me/${fundi.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(fundi.name)},%20I%20found%20you%20on%20FundiHub%20and%20need%20your%20services.`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageSquare className="mr-1 h-3 w-3" /> WhatsApp
                          </a>
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border bg-card/40 p-8 text-center">
            <Wrench className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">
              No matches yet
            </h3>
            <p className="mx-auto mt-1.5 max-w-xs text-xs text-muted-foreground">
              Set your project category to get matched with verified fundis
              instantly.
            </p>
            <Button size="sm" className="mt-4" asChild>
              <Link href="/client/dashboard/my-project">
                Set Project Category
              </Link>
            </Button>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-base font-bold text-foreground">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/client/dashboard/find-fundis"
            className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-primary/40 hover:bg-card/80"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                Find a Fundi
              </div>
              <div className="text-xs text-muted-foreground">
                Search all verified experts
              </div>
            </div>
          </Link>
          <Link
            href="/client/dashboard/my-project"
            className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-primary/40 hover:bg-card/80"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                My Project
              </div>
              <div className="text-xs text-muted-foreground">
                Update your requirements
              </div>
            </div>
          </Link>
          <Link
            href="/client/dashboard/profile"
            className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-primary/40 hover:bg-card/80"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <User className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                My Profile
              </div>
              <div className="text-xs text-muted-foreground">
                Update your account info
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
