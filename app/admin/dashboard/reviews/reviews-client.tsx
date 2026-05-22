"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, Search, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader } from "../../components/page-header"

interface ReviewRow {
  id: string
  reviewerName: string
  rating: number
  comment: string
  ip: string | null
  createdAt: string
  fundiProfile: {
    id: string
    title: string
    rating: number
    reviews: number
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString()
}

export function ReviewsClient() {
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<ReviewRow | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set("q", query.trim())
      const res = await fetch(`/api/admin/reviews?${params.toString()}`, {
        cache: "no-store",
      })
      const data = await res.json()
      setReviews(data.reviews ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [query])

  useEffect(() => {
    const t = setTimeout(load, 200)
    return () => clearTimeout(t)
  }, [load])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsSubmitting(true)
    try {
      await fetch(`/api/admin/reviews/${deleteTarget.id}`, {
        method: "DELETE",
      })
      setDeleteTarget(null)
      await load()
    } finally {
      setIsSubmitting(false)
    }
  }

  const avg =
    reviews.length === 0
      ? 0
      : reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        description="Moderate platform feedback. Deleting a review recalculates the fundi rating."
      />

      <div className="grid grid-cols-3 gap-3">
        <Pill label="Total" value={reviews.length} />
        <Pill label="Average rating" value={avg.toFixed(2)} />
        <Pill
          label="1-star reviews"
          value={reviews.filter((r) => r.rating === 1).length}
        />
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search reviewer or comment"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : (
          <ul className="max-h-[70vh] divide-y divide-border/40 overflow-y-auto">
            {reviews.map((r) => (
              <li key={r.id} className="p-4 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {r.reviewerName}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < r.rating ? "fill-current" : "stroke-current text-muted-foreground"}`}
                          />
                        ))}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      On {r.fundiProfile.title} · {formatDate(r.createdAt)}
                      {r.ip && ` · IP ${r.ip}`}
                    </div>
                    <p className="mt-2 leading-relaxed text-foreground/80">
                      {r.comment}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteTarget(r)}
                    className="shrink-0 cursor-pointer text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
            {reviews.length === 0 && (
              <li className="p-8 text-center text-muted-foreground">
                No reviews to moderate.
              </li>
            )}
          </ul>
        )}
      </div>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete review?</DialogTitle>
            <DialogDescription>
              This will remove the review and recalculate the fundi's rating.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Pill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card px-3 py-2">
      <div className="text-[10px] font-medium text-muted-foreground uppercase">
        {label}
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  )
}
