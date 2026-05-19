"use client"

import { useState } from "react"
import { Star, Calendar, MessageSquare, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Review {
  id: string
  reviewerName: string
  rating: number
  comment: string
  createdAt: string | Date
}

interface ReviewsListProps {
  fundiUserId: string
  initialReviews: Review[]
  clientReview?: {
    reviewerName: string
    rating: number
    comment: string
  } | null
}

export function ReviewsList({ fundiUserId, initialReviews, clientReview }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [reviewerName, setReviewerName] = useState(clientReview?.reviewerName || "")
  const [rating, setRating] = useState(clientReview?.rating || 5)
  const [comment, setComment] = useState(clientReview?.comment || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [isNameLocked, setIsNameLocked] = useState(!!clientReview)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewerName.trim() || !comment.trim()) {
      setError("Please fill in your name and comment.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/fundis/${fundiUserId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerName, rating, comment }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to submit review")
      }

      const newReview = await res.json()
      const isUpdate = reviews.some((r) => r.id === newReview.id) || isNameLocked

      setReviews((prevReviews) => {
        const exists = prevReviews.some((r) => r.id === newReview.id)
        if (exists) {
          const filtered = prevReviews.filter((r) => r.id !== newReview.id)
          return [newReview, ...filtered]
        }
        return [newReview, ...prevReviews]
      })

      setIsNameLocked(true)
      setSuccessMessage(isUpdate ? "Your review was updated successfully!" : "Review submitted successfully! Thank you.")
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateInput: string | Date) => {
    const date = new Date(dateInput)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div id="reviews-section" className="space-y-8 scroll-mt-24">
      <div className="grid gap-8 md:grid-cols-3">
        {/* Write a Review Section */}
        <div className="md:col-span-1">
          <Card className="sticky top-28 border border-border bg-card shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">Leave a Review</CardTitle>
              {/* <CardDescription>
                Share your experience hiring this expert to help others make informed decisions.
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Reviewer Name */}
                {!isNameLocked && (
                  <div className="space-y-1.5">
                    <label htmlFor="reviewer-name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      id="reviewer-name"
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-border/60 bg-muted/10 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-hidden transition-all duration-200"
                    />
                  </div>
                )}

                {/* Rating Row */}
                <div className="flex items-center justify-center py-3 border-b border-border/15 gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="transition-all duration-300 ease-out hover:scale-135 hover:rotate-12 active:scale-90 active:rotate-0 focus:outline-hidden cursor-pointer p-1"
                    >
                      <Star
                        className={`h-8 w-8 transition-all duration-300 ease-out ${
                          star <= (hoverRating ?? rating)
                            ? "fill-amber-500 text-amber-500 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.55)] scale-110"
                            : "text-muted-foreground/20 hover:text-muted-foreground/50"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Comment Box */}
                <div className="space-y-1.5">
                  <label htmlFor="comment" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    required
                    rows={4}
                    disabled={isSubmitting}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others how they did..."
                    className="w-full rounded-xl border border-border/60 bg-muted/10 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-hidden transition-all duration-200 resize-none"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs font-medium text-red-500 animate-in fade-in duration-200">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-medium text-emerald-500 animate-in fade-in duration-200">
                    {successMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-primary text-primary-foreground font-bold hover:bg-primary/95 flex items-center justify-center gap-2 rounded-xl transition-all duration-200 cursor-pointer shadow-sm shadow-primary/10"
                >
                  {isSubmitting ? "Submitting..." : isNameLocked ? "Update Review" : "Submit Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Existing Reviews List */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold">
              Client Feedback ({reviews.length})
            </h3>
          </div>

          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 p-12 text-center">
              <Star className="h-8 w-8 text-muted mb-2" />
              <p className="font-extrabold text-muted-foreground">No reviews yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Be the first client to leave a review for this fundi!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <Card key={rev.id} className="border border-border bg-card/50">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-extrabold text-foreground">
                          {rev.reviewerName}
                        </h4>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= rev.rating
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(rev.createdAt)}</span>
                      </div>
                    </div>
                    <Separator className="border-border/40" />
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                      {rev.comment}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
