"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  fundiName: string
  onSubmitSuccess?: () => void
}

export function ReviewModal({
  isOpen,
  onClose,
  fundiName,
  onSubmitSuccess,
}: ReviewModalProps) {
  const [reviewerName, setReviewerName] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!reviewerName.trim()) {
      setError("Please enter your name")
      return
    }
    if (rating === 0) {
      setError("Please select a rating")
      return
    }
    if (!comment.trim()) {
      setError("Please write a comment")
      return
    }

    setIsSubmitting(true)

    try {
      const slug = fundiName.trim().replace(/\s+/g, "-")
      const response = await fetch(
        `/api/fundis/${encodeURIComponent(slug)}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewerName: reviewerName.trim(),
            rating,
            comment: comment.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to submit review")
        setIsSubmitting(false)
        return
      }

      // Success
      setReviewerName("")
      setRating(0)
      setComment("")
      onClose()
      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
      // Refresh the page to show new review
      window.location.reload()
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setReviewerName("")
      setRating(0)
      setComment("")
      setError("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your experience working with {fundiName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="reviewerName">Your Name</Label>
            <Input
              id="reviewerName"
              placeholder="Enter your name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isSubmitting}
                  className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-amber-500 text-amber-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <textarea
              id="comment"
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              required
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
