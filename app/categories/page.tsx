"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { FundiCard } from "@/components/fundi-card"
import { CategoryCard } from "@/components/category-card"
import { Skeleton } from "@/components/ui/skeleton"
import { categories as fallbackCategories, Fundi } from "@/lib/data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CategoriesPage() {
  const [fundis, setFundis] = useState<Fundi[]>([])
  const [categories, setCategories] = useState<{ name: string; icon: string }[]>(fallbackCategories)
  const [isLoadingFundis, setIsLoadingFundis] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [fundisRes, categoriesRes] = await Promise.all([
          fetch("/api/fundis"),
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
    Array.from({ length: 6 }).map((_, index) => (
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
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
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
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-6 flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold">Browse All Categories</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Find expert fundis in your preferred category
          </p>
        </div>
      </section>

      {/* All Categories Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                icon={category.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Fundis */}
      <section className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold">All Available Fundis</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoadingFundis
              ? renderFundiSkeletons()
              : fundis.map((fundi) => <FundiCard key={fundi.id} fundi={fundi} />)}
          </div>
        </div>
      </section>
    </div>
  )
}
