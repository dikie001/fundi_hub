"use client"

import { Navigation } from "@/components/navigation"
import { FundiCard } from "@/components/fundi-card"
import { CategoryCard } from "@/components/category-card"
import { Button } from "@/components/ui/button"
import { fundis, categories } from "@/lib/data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="mb-6 flex items-center gap-2 text-primary hover:underline">
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
              <CategoryCard key={category.name} name={category.name} icon={category.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Fundis */}
      <section className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold">All Available Fundis</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fundis.map((fundi) => (
              <FundiCard key={fundi.id} fundi={fundi} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
