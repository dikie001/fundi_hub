"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Check } from "lucide-react"

interface ShareButtonProps {
  className?: string
  sharePath?: string
  title?: string
}

export function ShareButton({ className, sharePath, title = "Share Portfolio" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = sharePath ? `${window.location.origin}${sharePath}` : window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: "FundiHub Portfolio Showcase",
          url: url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      // Fallback copy
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        console.error("Failed to share/copy:", err)
      }
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={`gap-1.5 font-bold rounded-xl cursor-pointer hover:bg-muted select-none transition-all ${className}`}
      onClick={handleShare}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-500 animate-in zoom-in-50 duration-200" />
          <span className="text-emerald-500">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 text-primary" />
          <span>{title}</span>
        </>
      )}
    </Button>
  )
}
