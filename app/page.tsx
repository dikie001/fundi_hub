"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { FundiCard } from "@/components/fundi-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Fundi } from "@/lib/types"
import { Search, ChevronLeft, ChevronRight, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [fundis, setFundis] = useState<Fundi[]>([])
  const [isLoadingFundis, setIsLoadingFundis] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [checkingSession, setCheckingSession] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Auto-redirect logged-in users to their dashboard
  useEffect(() => {
    let cancelled = false
    fetch("/api/auth/me", { cache: "no-store", credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled) return
        const role = d?.user?.role
        if (role === "fundi") {
          window.location.replace("/fundi/dashboard")
        } else if (role === "client") {
          window.location.replace("/client/dashboard")
        } else if (role === "admin") {
          window.location.replace("/admin/dashboard")
        } else {
          setCheckingSession(false)
        }
      })
      .catch(() => {
        if (!cancelled) setCheckingSession(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

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

  const renderFundiSkeletons = (count = 12) =>
    Array.from({ length: count }).map((_, index) => (
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

  const filteredFundis = fundis.filter((f) => {
    const query = searchQuery.trim().toLowerCase()
    if (query === "") return true // Show all fundis when not searching

    return (
      f.name.toLowerCase().includes(query) ||
      f.category.toLowerCase().includes(query) ||
      f.title.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query) ||
      (f.serviceArea && f.serviceArea.toLowerCase().includes(query)) ||
      (f.skills && f.skills.toLowerCase().includes(query))
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredFundis.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentFundis = filteredFundis.slice(startIndex, endIndex)

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const hasSearch = searchQuery.trim() !== ""

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      {/* Hero Section with Search */}
      <section
        id="home"
        className="relative scroll-mt-24 overflow-hidden bg-linear-to-b from-primary/5 to-transparent px-4 pt-16 pb-6 sm:px-6 lg:px-8"
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
                <Search className="absolute top-1/2 right-5 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
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

      {/* Main Content - All Fundis with Pagination */}
      <section className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Results Header */}
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">
              {hasSearch ? (
                <>
                  Search Results
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({filteredFundis.length} found)
                  </span>
                </>
              ) : (
                <>
                  All Fundis
                  <Badge variant="secondary" className="ml-2">
                    {filteredFundis.length} available
                  </Badge>
                </>
              )}
            </h2>
            {filteredFundis.length > itemsPerPage && (
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>

          {/* Fundis Grid */}
          {isLoadingFundis ? (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {renderFundiSkeletons()}
            </div>
          ) : currentFundis.length > 0 ? (
            <>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentFundis.map((fundi) => (
                  <FundiCard key={fundi.id} fundi={fundi} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-full sm:w-auto"
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/50 py-16 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                {hasSearch ? "No matching fundis found" : "No fundis available"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground/70">
                {hasSearch
                  ? "Try different search terms"
                  : "Check back later for new professionals"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Compact Footer - Mobile Optimized */}
      <footer className="mt-auto border-t border-border bg-muted/30">
        {/* Desktop Footer */}
        <div className="hidden px-4 py-8 sm:block sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <h3 className="font-semibold">FundiHub</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Kenya's trusted skilled worker platform
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Quick Links</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <Link
                      href="/refer-earn"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Refer & Earn
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/for-fundis"
                      className="text-muted-foreground hover:text-primary"
                    >
                      For Fundis
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Categories
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium">Legal</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <Link
                      href="/privacy"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium">Contact</h4>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <a
                    href="mailto:calvincewise@gmail.com"
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email Us
                  </a>
                  <a
                    href="tel:+254799112919"
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    +254 799 112 919
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted-foreground">
              © 2026 FundiHub. All rights reserved.
            </div>
          </div>
        </div>

        {/* Mobile Footer - Compact */}
        <div className="px-4 py-4 sm:hidden">
          <div className="flex flex-col gap-3">
            {/* Quick Links Row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <Link
                href="/refer-earn"
                className="text-muted-foreground hover:text-primary"
              >
                Refer & Earn
              </Link>
              <Link
                href="/for-fundis"
                className="text-muted-foreground hover:text-primary"
              >
                For Fundis
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-primary"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary"
              >
                Terms
              </Link>
            </div>

            {/* Contact Row */}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <a href="tel:+254799112919" className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Call
              </a>
              <a
                href="mailto:calvincewise@gmail.com"
                className="flex items-center gap-1"
              >
                <Mail className="h-3 w-3" />
                Email
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center text-xs text-muted-foreground/70">
              © 2026 FundiHub
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
