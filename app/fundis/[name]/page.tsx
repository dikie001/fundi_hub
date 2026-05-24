import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { Navigation } from "@/components/navigation"
import { ReviewsList } from "@/components/reviews-list"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  Award,
  Shield,
  Clock,
  Briefcase,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
} from "lucide-react"
import type { ReviewData } from "@/lib/types"

type PortfolioItem = {
  id: string
  title: string
  category: string
  image: string
  description?: string
}

type FundiPageData = {
  id: string
  name: string
  title: string
  category: string
  rating: number
  reviews: number
  image: string
  phone: string
  whatsapp: string
  premiumLevel: "none" | "verified" | "top"
  isAvailable: boolean
  isNearby: boolean
  preferredContact: string
  description: string
  yearsExperience: string
  serviceArea: string
  skills: string[]
  portfolio: PortfolioItem[]
  jobsCompleted: number
  successRate: number
  jobEarnings: number
  reviewsList: ReviewData[]
}

interface PageProps {
  params: Promise<{ name: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const decodedName = decodeURIComponent(resolvedParams.name).replace(/-/g, " ")
  return {
    title: `${decodedName} - Professional Fundi Profile | FundiHub`,
    description: `View ${decodedName}'s professional portfolio, verified credentials, service area, skills, and client reviews on FundiHub.`,
  }
}

export default async function FundiProfilePage({ params }: PageProps) {
  const resolvedParams = await params
  const decodedName = decodeURIComponent(resolvedParams.name).replace(/-/g, " ")

  // 1. Fetch Client IP
  const headersList = await headers()
  const forwardedFor = headersList.get("x-forwarded-for")
  let clientIp = "127.0.0.1"
  if (forwardedFor) {
    clientIp = forwardedFor.split(",")[0].trim()
  } else {
    const realIp = headersList.get("x-real-ip")
    if (realIp) {
      clientIp = realIp.trim()
    }
  }

  // 2. Fetch from Database
  const dbUsers = await db.user.findMany({
    where: {
      role: "fundi",
    },
    include: {
      fundiProfile: {
        include: {
          reviewsList: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  })

  const cleanParamName = decodedName.trim().replace(/\s+/g, " ").toLowerCase()
  const dbUser = dbUsers.find((u) => {
    const cleanDbName = u.name.trim().replace(/\s+/g, " ").toLowerCase()
    return cleanDbName === cleanParamName
  })

  let fundiData: FundiPageData | null = null
  let clientReview: {
    reviewerName: string
    rating: number
    comment: string
  } | null = null

  if (dbUser && dbUser.fundiProfile) {
    const profile = dbUser.fundiProfile

    // Find if current client IP already left a review
    const existingReview = (profile.reviewsList || []).find(
      (r) => r.ip === clientIp
    )
    if (existingReview) {
      clientReview = {
        reviewerName: existingReview.reviewerName,
        rating: existingReview.rating,
        comment: existingReview.comment,
      }
    }
    let parsedPortfolio: PortfolioItem[] = []
    if (typeof profile.portfolio === "string" && profile.portfolio.trim()) {
      try {
        parsedPortfolio = JSON.parse(profile.portfolio) as PortfolioItem[]
      } catch {
        parsedPortfolio = []
      }
    }

    const skillsArray =
      typeof profile.skills === "string" && profile.skills.trim()
        ? profile.skills
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : []

    fundiData = {
      id: dbUser.id,
      name: dbUser.name,
      title: profile.title || "Professional Technician",
      category: profile.category,
      rating: profile.rating,
      reviews: profile.reviews,
      image: profile.image || "",
      phone: dbUser.phone,
      whatsapp: dbUser.phone,
      premiumLevel: profile.premiumLevel,
      isAvailable: profile.isAvailable,
      isNearby: profile.isNearby,
      preferredContact: profile.preferredContact || "whatsapp",
      description: profile.description || "No bio description provided.",
      yearsExperience: profile.yearsExperience || "N/A",
      serviceArea: profile.serviceArea || "N/A",
      skills: skillsArray,
      portfolio: parsedPortfolio,
      jobsCompleted: profile.jobsCompleted,
      successRate: profile.successRate,
      jobEarnings: profile.jobEarnings,
      reviewsList: profile.reviewsList || [],
    }
  }

  if (!fundiData) {
    notFound()
  }

  const initials = fundiData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Hero Header Card */}
        <div className="relative mb-8 overflow-hidden rounded-xl border border-border/50 bg-card p-6 shadow-xs md:p-8">
          {/* Neon/Premium Backdrop glow */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-row items-center gap-4 sm:gap-6">
              {/* Profile Avatar */}
              <div
                className={`relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border bg-muted/40 shadow-inner ring-4 sm:h-28 sm:w-28 ${
                  fundiData.premiumLevel === "top" ||
                  fundiData.premiumLevel === "verified"
                    ? "border-indigo-500/40 ring-indigo-500/20"
                    : "border-border ring-border/20"
                }`}
              >
                {fundiData.image ? (
                  <Image
                    src={fundiData.image}
                    alt={fundiData.name}
                    fill
                    unoptimized
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-black text-muted-foreground">
                    {initials}
                  </span>
                )}
              </div>

              {/* Bio Identity details */}
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {fundiData.name}
                  </h1>
                  <div className="flex flex-wrap gap-1.5">
                    {(fundiData.premiumLevel === "top" ||
                      fundiData.premiumLevel === "verified") && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 border-indigo-500/25 bg-indigo-500/5 px-2 py-0.5 text-[10px] font-bold text-indigo-600 shadow-xs dark:text-indigo-400"
                      >
                        <Star size={10} className="fill-current" />
                        Premium Partner
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm font-semibold text-muted-foreground sm:text-base">
                  {fundiData.title}
                </p>

                {/* Meta details list */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-muted-foreground sm:text-sm">
                  <span className="flex shrink-0 items-center gap-1 font-bold text-foreground">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    {fundiData.rating}
                    <span className="font-medium text-muted-foreground">
                      ({fundiData.reviews}{" "}
                      {fundiData.reviews === 1 ? "review" : "reviews"})
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {fundiData.serviceArea}
                  </span>
                  <span className="shrink-0 rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-[9px] font-bold text-primary uppercase sm:text-[10px]">
                    {fundiData.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status Pill badges */}
            <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
              {fundiData.isAvailable && (
                <Badge
                  variant="outline"
                  className="border-red-500/30 bg-red-500/10 px-3 py-1 font-bold text-red-500 hover:bg-red-500/15"
                >
                  Available 24/7
                </Badge>
              )}
              {fundiData.isNearby && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-bold text-emerald-400 hover:bg-emerald-500/15"
                >
                  Nearby
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Detail Content Grid */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {/* Main Info Column (Left 2/3) */}
          <div className="space-y-8 md:col-span-2">
            {/* About Card */}
            <Card className="border-border/50 bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Award className="h-5 w-5 text-primary" />
                  Biography & Bio Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {fundiData.description}
                </p>

                <Separator className="bg-border/50" />

                {/* Experience & Stats Row */}
                <div className="flex flex-wrap justify-between gap-4 pt-2 sm:justify-start sm:gap-16">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Experience
                    </span>
                    <p className="text-sm font-bold text-foreground">
                      {fundiData.yearsExperience}{" "}
                      {fundiData.yearsExperience.trim() === "1"
                        ? "year"
                        : "years"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Success Rating
                    </span>
                    <p className="text-sm font-bold text-foreground">
                      {Math.round((fundiData.rating / 5) * 100)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Card */}
            {fundiData.skills && fundiData.skills.length > 0 && (
              <Card className="border-border/50 bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Specializations & Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {fundiData.skills.map((skill: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="rounded-lg border border-border/50 bg-muted px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted/80"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Portfolio Card */}
            <Card className="border-border/50 bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Portfolio Showcase
                </CardTitle>
                <CardDescription>
                  Recent projects and work completed by {fundiData.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fundiData.portfolio && fundiData.portfolio.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {fundiData.portfolio.slice(0, 1).map((item, index) => (
                        <div
                          key={item.id || index}
                          className="group overflow-hidden rounded-xl border border-border/50 bg-muted/20 transition-all hover:border-primary/30"
                        >
                          <div className="relative aspect-video w-full overflow-hidden bg-muted/60">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <Sparkles className="h-8 w-8 opacity-40" />
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h4 className="truncate text-xs font-bold text-foreground">
                              {item.title}
                            </h4>
                            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {fundiData.portfolio.length > 1 && (
                      <div className="border-t border-border/15 pt-2">
                        <Button
                          variant="outline"
                          className="flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl text-xs font-bold hover:bg-muted"
                          asChild
                        >
                          <Link
                            href={`/fundis/${resolvedParams.name}/portfolio`}
                          >
                            See More Projects ({fundiData.portfolio.length})
                            <ExternalLink className="h-3.5 w-3.5 text-primary" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/10 py-12 text-center">
                    <Briefcase className="mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="text-sm font-semibold text-muted-foreground">
                      No portfolio showcase projects added yet.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      This expert is currently updating their photo gallery.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Connect Column (Right 1/3) */}
          <div className="space-y-6">
            {/* Direct Connect Action Widget */}
            <Card className="sticky top-20 border-2 border-primary/20 bg-linear-to-b from-card via-card to-primary/5 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-black tracking-tight">
                  Direct Connect
                </CardTitle>
                <CardDescription className="text-xs">
                  Connect instantly. No booking fee or middleman involved.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Buttons */}
                <div className="space-y-2">
                  <Button
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground transition-all hover:bg-primary/90"
                    asChild
                  >
                    <a
                      href={`https://wa.me/${fundiData.whatsapp.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(fundiData.name)},%20I%20saw%20your%20profile%20on%20FundiHub%20and%20need%20assistance.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Chat on WhatsApp
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-border bg-background font-bold text-foreground hover:bg-muted"
                    asChild
                  >
                    <a href={`tel:${fundiData.phone}`}>
                      <Phone className="h-4 w-4" />
                      Call directly
                    </a>
                  </Button>
                </div>

                <div className="space-y-2 rounded-lg border border-border/30 bg-muted/40 p-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Availability</span>
                  </div>
                  <p className="leading-relaxed">
                    Preferred contact:{" "}
                    <span className="font-semibold text-foreground capitalize">
                      {fundiData.preferredContact}
                    </span>
                    .
                    {fundiData.isAvailable
                      ? " Currently available for new bookings."
                      : " Currently unavailable for new bookings."}
                  </p>
                </div>

                {/* <div className="space-y-2.5 pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-muted-foreground font-medium">Verified credentials & background checks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-muted-foreground font-medium">Pay directly to the technician</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-muted-foreground font-medium">Direct WhatsApp response</span>
                  </div>
                </div> */}
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-10" />

        {/* Reviews Section */}
        <div className="mt-8">
          <ReviewsList
            fundiUserId={fundiData.id}
            initialReviews={fundiData.reviewsList || []}
            clientReview={clientReview}
          />
        </div>
      </main>
    </div>
  )
}
