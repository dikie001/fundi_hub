"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { FundiCard } from "@/components/fundi-card"
import { CategoryCard } from "@/components/category-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { categories as fallbackCategories, Fundi } from "@/lib/data"
import {
  ArrowRight,
  TrendingUp,
  MapPin,
  AlertCircle,
  Clock,
  BarChart3,
  Heart,
} from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [fundis, setFundis] = useState<Fundi[]>([])
  const [categories, setCategories] =
    useState<{ name: string; icon: string }[]>(fallbackCategories)
  const [isLoadingFundis, setIsLoadingFundis] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [fundisRes, categoriesRes] = await Promise.all([
          fetch("/api/fundis", { cache: "no-store" }),
          fetch("/api/categories"),
        ])
        if (fundisRes.ok) {
          const fundisData = await fundisRes.json()
          setFundis(Array.isArray(fundisData) ? fundisData : [])
        }
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }
      } catch (error) {
        console.error("Failed to load DB data:", error)
      } finally {
        setIsLoadingFundis(false)
      }
    }
    loadData()
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

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/10 to-transparent px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Book Skilled Experts <span className="text-primary">Anytime</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Find trusted fundis - plumbers, electricians, carpenters, and
              more. Direct WhatsApp and call buttons for instant communication.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/categories">Find a Fundi</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fundis */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Featured Fundis</h2>
              <p className="mt-2 text-muted-foreground">
                Top & Verified premium experts
              </p>
            </div>
            <Link href="/categories">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight size={16} />
              </Button>
            </Link>
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

      {/* Top Rated Experts */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
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

      {/* Nearby Fundis */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-3xl font-bold">
                <MapPin className="text-primary" />
                Nearby Fundis
              </h2>
              <p className="mt-2 text-muted-foreground">Experts in your area</p>
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

      {/* Emergency Services */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
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

      {/* Categories Section */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Popular Categories</h2>
            <p className="mt-2 text-muted-foreground">
              Browse fundis by expertise
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                icon={category.icon}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Refer & Earn Banner */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
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
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
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

            <Card>
              <CardHeader>
                <CardTitle>Premium Badges</CardTitle>
                <CardDescription className="text-sm">
                  Additional visibility options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">✅ Verified Badge</p>
                    <p className="text-muted-foreground">Ksh 300/month</p>
                  </div>
                  <div>
                    <p className="font-medium">⭐ Top & Verified Badge</p>
                    <p className="text-muted-foreground">Ksh 500/month</p>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Learn More
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
                  <Link href="/categories" className="hover:text-primary">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/refer-earn" className="hover:text-primary">
                    Refer & Earn
                  </Link>
                </li>
                <li>
                  <Link href="/for-fundis" className="hover:text-primary">
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
