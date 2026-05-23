"use client"

import { useDashboard } from "../context/DashboardContext"
import { useState, useMemo } from "react"
import {
  Search,
  Star,
  Phone,
  MessageSquare,
  MapPin,
  Briefcase,
  Filter,
  ShieldCheck,
  Zap,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const TRADES = [
  "All",
  "Plumber",
  "Electrician",
  "Carpenter",
  "Painter",
  "Mason",
  "Welder",
  "Appliance Repair",
  "HVAC Tech",
  "Cleaner",
  "Gardener",
]

export default function FindFundisPage() {
  const { allFundis, profile } = useDashboard()
  const [search, setSearch] = useState("")
  const [tradeFilter, setTradeFilter] = useState("All")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [availableOnly, setAvailableOnly] = useState(false)

  const filtered = useMemo(() => {
    return allFundis.filter((f) => {
      const tradeName = (f.trade || f.category || "").toLowerCase()
      const matchSearch =
        !search ||
        (f.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (f.title || "").toLowerCase().includes(search.toLowerCase()) ||
        tradeName.includes(search.toLowerCase()) ||
        (f.serviceArea || "").toLowerCase().includes(search.toLowerCase())
      const matchTrade =
        tradeFilter === "All" || tradeName === tradeFilter.toLowerCase()
      const matchVerified = !verifiedOnly || f.verified
      const matchAvailable = !availableOnly || f.isAvailable
      return matchSearch && matchTrade && matchVerified && matchAvailable
    })
  }, [allFundis, search, tradeFilter, verifiedOnly, emergencyOnly])

  const clearFilters = () => {
    setSearch("")
    setTradeFilter("All")
    setVerifiedOnly(false)
    setAvailableOnly(false)
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Find Fundis</h1>
        <p className="text-sm text-muted-foreground">
          Browse and contact verified service experts near you.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, trade, or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Trade filter chips */}
        <div className="flex flex-wrap gap-2">
          {TRADES.map((t) => (
            <button
              key={t}
              onClick={() => setTradeFilter(t)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                tradeFilter === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Toggle filters + result count */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              verifiedOnly
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" /> Verified Only
          </button>
          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              availableOnly
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-border text-muted-foreground hover:border-emerald-500/40"
            }`}
          >
            <Zap className="h-3.5 w-3.5" /> Available Now
          </button>
          <span className="ml-auto flex items-center text-xs text-muted-foreground">
            <Filter className="mr-1 h-3.5 w-3.5" />
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Fundi Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((fundi) => (
            <Card
              key={fundi.id}
              className="border-border/80 bg-card transition-colors hover:border-primary/40"
            >
              <CardContent className="space-y-3 p-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                  {fundi.image ? (
                    <img
                      src={fundi.image}
                      alt={fundi.name}
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary uppercase">
                      {fundi.name?.slice(0, 2) || "FU"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-bold text-foreground">
                        {fundi.name}
                      </span>
                      {fundi.verified && (
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                      )}
                      {fundi.isAvailable && (
                        <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1 py-0.5 text-[8px] font-bold text-emerald-600 uppercase dark:text-emerald-400">
                          Available
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {fundi.title}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold">
                          {fundi.rating?.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        ({fundi.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3 shrink-0 text-primary" />
                    <span className="truncate">
                      {fundi.trade || fundi.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0 text-primary" />
                    <span className="truncate">
                      {fundi.serviceArea || "Nairobi"}
                    </span>
                  </div>
                </div>

                {fundi.description && (
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {fundi.description}
                  </p>
                )}

                {(fundi.premiumLevel === "top" ||
                  fundi.premiumLevel === "verified") && (
                  <Badge
                    variant="outline"
                    className="border-amber-500/20 bg-amber-500/10 text-[10px] text-amber-600"
                  >
                    â˜…{" "}
                    {fundi.premiumLevel === "top"
                      ? "Top Expert"
                      : "Verified Pro"}
                  </Badge>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 border-t border-border/30 pt-1">
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
                      <Button size="sm" asChild className="h-8 flex-1 text-xs">
                        <a
                          href={`https://wa.me/${fundi.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(fundi.name)},%20I%20found%20you%20on%20FundiHub%20and%20need%20help%20with%20${encodeURIComponent(profile?.projectCategory || "a project")}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageSquare className="mr-1 h-3 w-3" /> WhatsApp
                        </a>
                      </Button>
                    </>
                  )}
                </div>
                <Link
                  href={`/fundis/${encodeURIComponent(fundi.name?.toLowerCase().replace(/\s+/g, "-") || fundi.id)}`}
                  className="block text-center text-[11px] text-primary hover:underline"
                >
                  View Full Profile â†’
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="mb-3 h-10 w-10 text-muted-foreground" />
          <h3 className="text-sm font-bold text-foreground">No fundis found</h3>
          <p className="mt-1.5 max-w-xs text-xs text-muted-foreground">
            Try adjusting your search or filters to find the right expert for
            your project.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={clearFilters}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}
