import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { Navigation } from "@/components/navigation"
import { ShareButton } from "@/components/share-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ArrowLeft,
  Briefcase,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

type PortfolioItem = {
  id: string
  title: string
  category: string
  image: string
  description?: string
}

interface PageProps {
  params: Promise<{ name: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const decodedName = decodeURIComponent(resolvedParams.name).replace(/-/g, " ")
  return {
    title: `${decodedName}'s Portfolio Projects | FundiHub`,
    description: `Browse all work showcases and projects completed by ${decodedName} on FundiHub.`,
  }
}

export default async function FundiPortfolioPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const decodedName = decodeURIComponent(resolvedParams.name).replace(/-/g, " ")
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10)

  // Fetch the Fundi from database
  const dbUsers = await db.user.findMany({
    where: { role: "fundi" },
    include: { fundiProfile: true },
  })

  const cleanParamName = decodedName.trim().replace(/\s+/g, " ").toLowerCase()
  const dbUser = dbUsers.find((u) => {
    const cleanDbName = u.name.trim().replace(/\s+/g, " ").toLowerCase()
    return cleanDbName === cleanParamName
  })

  if (!dbUser || !dbUser.fundiProfile) {
    notFound()
  }

  const profile = dbUser.fundiProfile
  let portfolioItems: PortfolioItem[] = []
  if (typeof profile.portfolio === "string" && profile.portfolio.trim()) {
    try {
      portfolioItems = JSON.parse(profile.portfolio) as PortfolioItem[]
    } catch {
      portfolioItems = []
    }
  }

  // Pagination constants
  const itemsPerPage = 4
  const totalItems = portfolioItems.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const validPage = Math.max(1, Math.min(currentPage, totalPages))

  // Paginated items slice
  const startIndex = (validPage - 1) * itemsPerPage
  const paginatedItems = portfolioItems.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const profileUrl = `/fundis/${resolvedParams.name}`

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link Row */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer gap-1.5 rounded-xl font-bold hover:bg-muted"
              asChild
            >
              <Link href={profileUrl}>
                <ArrowLeft className="h-4 w-4 text-primary" />
                Back to Profile
              </Link>
            </Button>
            <ShareButton />
          </div>
          <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Project Gallery ({totalItems})
          </div>
        </div>

        {/* Header Block */}
        <div className="relative mb-8 overflow-hidden rounded-xl border border-border/50 bg-card p-6 shadow-xs md:p-8">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative z-10 space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {dbUser.name}&apos;s Portfolio Showcases
            </h1>
            <p className="max-w-2xl text-sm font-medium text-muted-foreground">
              Explore the professional installations, repairs, and projects
              completed by {dbUser.name}. Showing page {validPage} of{" "}
              {totalPages}.
            </p>
          </div>
        </div>

        {/* Portfolio Grid */}
        {paginatedItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {paginatedItems.map((item, index) => (
              <Card
                key={item.id || index}
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted/40">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted/20 text-muted-foreground">
                      <Sparkles className="h-10 w-10 text-primary/30" />
                    </div>
                  )}
                </div>
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="secondary"
                      className="rounded-md border border-primary/10 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase hover:bg-primary/15"
                    >
                      {item.category || "General"}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 truncate text-sm font-extrabold text-foreground transition-colors duration-200 group-hover:text-primary">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {item.description ? (
                    <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground/60 italic">
                      Professional job done matching clients requirements.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-card py-20 text-center">
            <Briefcase className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-lg font-bold text-foreground">
              No portfolio projects uploaded
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              This fundi is working on uploading more showcases soon. Please
              check back later!
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              disabled={validPage <= 1}
              className="cursor-pointer gap-1 rounded-xl border-border text-xs font-bold hover:bg-muted disabled:opacity-50"
              asChild={validPage > 1}
            >
              {validPage > 1 ? (
                <Link href={`${profileUrl}/portfolio?page=${validPage - 1}`}>
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
              ) : (
                <span>
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </span>
              )}
            </Button>

            <span className="text-xs font-semibold text-muted-foreground">
              Page {validPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={validPage >= totalPages}
              className="cursor-pointer gap-1 rounded-xl border-border text-xs font-bold hover:bg-muted disabled:opacity-50"
              asChild={validPage < totalPages}
            >
              {validPage < totalPages ? (
                <Link href={`${profileUrl}/portfolio?page=${validPage + 1}`}>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
