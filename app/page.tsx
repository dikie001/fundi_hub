"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { FundiCard } from "@/components/fundi-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Fundi } from "@/lib/types"
import {
  TrendingUp,
  MapPin,
  AlertCircle,
  Clock,
  BarChart3,
  Heart,
  Search,
  Sparkles,
  Star,
} from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [fundis, setFundis] = useState<Fundi[]>([])
  const [isLoadingFundis, setIsLoadingFundis] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function loadData() {
      try {
        const fundisRes = await fetch("/api/fundis", { cache: "no-store" })
        if (fundisRes.ok) {
          const fundisData = await fundisRes.json()
          setFundis(Array.isArray(fundisData) ? fundisData : [])
        }
      } catch (error) {
        console.error("Failed to load DB data:", error)
      } finally {
        setIsLoadingFundis(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    // Read filter query from URL if navigated from subpage
    const params = new URLSearchParams(window.location.search)
    const filter = params.get("filter")
    if (filter) {
      setSearchQuery(filter)
      setTimeout(() => {
        const sec = document.getElementById("categories")
        if (sec) {
          sec.scrollIntoView({ behavior: "smooth" })
        }
      }, 300)
    }
  }, [])

  const renderFundiSkeletons = () =>
    Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5"
      >
        <div className="mb-5 flex items-start gap-3">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="ml-auto h-5 w-24 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    ))

  const featuredFundis = fundis
    .filter((f) => f.premiumLevel === "top")
    .slice(0, 3)
  const topRatedFundis = [...fundis]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
  const nearbyFundis = fundis.filter((f) => f.isNearby).slice(0, 3)
  const emergencyFundis = fundis.filter((f) => f.isEmergency).slice(0, 3)

  const filteredFundis = fundis.filter((f) => {
    const query = searchQuery.trim().toLowerCase()
    if (query === "") return false

    return (
      f.name.toLowerCase().includes(query) ||
      f.category.toLowerCase().includes(query) ||
      f.title.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query) ||
      (f.serviceArea && f.serviceArea.toLowerCase().includes(query)) ||
      (f.skills && f.skills.toLowerCase().includes(query))
    )
  })

  const hasSearch = searchQuery.trim() !== ""

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      {/* Hero Section with Integrated Search */}
      <section
        id="home"
        className="relative scroll-mt-24 overflow-hidden bg-linear-to-b from-primary/10 to-transparent px-4 pt-20 pb-8 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Book Skilled Experts <span className="text-primary">Anytime</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Kenya’s trusted platform for finding skilled fundis. Verified
              professionals.
            </p>

            {/* Integrated Search Bar */}
            <div
              id="categories"
              className="relative mx-auto mt-8 max-w-xl scroll-mt-28"
            >
              <input
                type="text"
                placeholder="Search for plumbers, electricians, painters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 w-full rounded-2xl border border-border bg-card/90 px-6 pr-12 text-sm text-foreground shadow-lg transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
              />
              {hasSearch ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-4 -translate-y-1/2 rounded-md bg-muted px-2.5 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                >
                  Clear
                </button>
              ) : (
                <Search className="absolute top-1/2 right-5 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              )}
            </div>
{/* 
            {!hasSearch && (
              <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link href="/auth/signup">Get Started as Fundi</Link>
                </Button>
              </div>
            )} */}
          </div>
        </div>
      </section>

      {/* Dynamic Search Results Section */}
      {hasSearch && (
        <section className="animate-in border-b border-border bg-muted/10 px-4 pt-8 pb-16 duration-300 fade-in slide-in-from-top-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h3 className="text-lg font-bold text-foreground">
                Search Results for &quot;{searchQuery}&quot;
              </h3>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 px-3 py-1 font-bold text-primary"
              >
                {filteredFundis.length} matching{" "}
                {filteredFundis.length === 1 ? "expert" : "experts"}
              </Badge>
            </div>

            {filteredFundis.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredFundis.map((fundi) => (
                  <FundiCard key={fundi.id} fundi={fundi} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card py-20 text-center">
                <p className="text-lg font-extrabold text-muted-foreground">
                  No matching fundis found
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground/60">
                  Try searching for other trades, skills, or locations (e.g.
                  Plumbers, Mombasa)
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Fundis - Hidden when searching */}
      {!hasSearch && (
        <section
          id="featured"
          className="scroll-mt-24 border-b border-border px-4 pt-8 pb-16 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Featured Fundis</h2>
                <p className="mt-2 text-muted-foreground">
                  Top & Verified premium experts
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {isLoadingFundis
                ? renderFundiSkeletons()
                : featuredFundis.map((fundi) => (
                    <FundiCard key={fundi.id} fundi={fundi} />
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Rated Experts - Hidden when searching */}
      {!hasSearch && (
        <section className="border-b border-border px-4 pt-8 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Top Rated Experts</h2>
              <p className="mt-2 text-muted-foreground">
                Highest rated fundis on the platform
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {isLoadingFundis
                ? renderFundiSkeletons()
                : topRatedFundis.map((fundi) => (
                    <FundiCard key={fundi.id} fundi={fundi} />
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* Nearby Fundis - Hidden when searching */}
      {!hasSearch && (
        <section className="border-b border-border px-4 pt-8 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-3xl font-bold">
                  <MapPin className="text-primary" />
                  Nearby Fundis
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Experts in your area
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {isLoadingFundis
                ? renderFundiSkeletons()
                : nearbyFundis.map((fundi) => (
                    <FundiCard key={fundi.id} fundi={fundi} />
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* Emergency Services - Hidden when searching */}
      {!hasSearch && (
        <section className="border-b border-border px-4 pt-8 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-3xl font-bold">
                  <AlertCircle className="text-red-500" />
                  24/7 Emergency Services
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Always available when you need help
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {isLoadingFundis
                ? renderFundiSkeletons()
                : emergencyFundis.map((fundi) => (
                    <FundiCard key={fundi.id} fundi={fundi} />
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* Refer & Earn Banner */}
      <section
        id="refer-earn"
        className="scroll-mt-24 border-b border-border px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <Card className="border-2 border-primary/20 bg-linear-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-3xl">
                    <TrendingUp className="text-primary" />
                    Refer & Earn
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">
                    Earn Ksh 100 for each fundi you refer to FundiHub
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-muted-foreground">
                Know skilled workers? Refer them to FundiHub and earn
                commissions. It&apos;s easy, rewarding, and helps grow the
                platform.
              </p>
              <Button asChild size="lg">
                <Link href="/refer-earn">Start Referring Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose FundiHub */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Choose FundiHub?
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Heart className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Trusted Experts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Verified profiles and ratings help you find the right expert
                  for your needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Direct Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chat via WhatsApp or call directly. No middleman, just fast
                  connection.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Transparent Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simple, affordable registration and monthly fees. No hidden
                  charges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section
        id="for-fundis"
        className="scroll-mt-24 border-b border-border px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Fundi Membership Plans
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            Flexible pricing for every fundi
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>One-Time Registration</CardTitle>
                <CardDescription className="text-2xl font-bold text-primary">
                  Ksh 200
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Account creation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Profile setup
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Listing activation
                  </li>
                </ul>
                <Button className="w-full">Get Started</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Subscription</CardTitle>
                <CardDescription className="text-2xl font-bold text-primary">
                  Ksh 500/month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Keep profile active
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Remain searchable
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Get job leads
                  </li>
                </ul>
                <Button className="w-full">Subscribe Now</Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-card to-card shadow-lg shadow-amber-500/5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-amber-500/20 blur-xl pointer-events-none" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-foreground font-bold">
                    <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                    Premium Partner Badge
                  </CardTitle>
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-black text-amber-500 uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
                <CardDescription className="text-2xl font-black text-primary pt-1">
                  Ksh 500<span className="text-xs font-semibold text-muted-foreground">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
                    <span>Gold Premium badge on profile & card</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
                    <span>Always display at the top of searches</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
                    <span>5x matching priority for new job leads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
                    <span>Instant client trust verification</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-none text-white font-bold cursor-pointer" asChild>
                  <Link href="/auth/signup">Upgrade Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-bold">FundiHub</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Connecting skilled experts with clients across Africa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Quick Links</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="#categories" className="hover:text-primary">
                    Search Experts
                  </Link>
                </li>
                <li>
                  <Link href="#refer-earn" className="hover:text-primary">
                    Refer & Earn
                  </Link>
                </li>
                <li>
                  <Link href="#for-fundis" className="hover:text-primary">
                    For Fundis
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Support</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:calvincewise@gmail.com"
                    className="hover:text-primary"
                  >
                    Email Us
                  </a>
                </li>
                <li>
                  <a href="tel:+254799112919" className="hover:text-primary">
                    Call: +254799112919
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Contact</h4>
              <p className="mt-4 text-sm text-muted-foreground">
                <strong>Founder:</strong> Calvince Ouma
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <strong>Email:</strong> calvincewise@gmail.com
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; 2026 FundiHub. All rights reserved. Africa&apos;s trusted
              skilled worker platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
