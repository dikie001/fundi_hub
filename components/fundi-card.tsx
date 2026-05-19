"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone, Star, MapPin } from "lucide-react"
import type { Fundi } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface FundiCardProps {
  fundi: Fundi
}

export function FundiCard({ fundi }: FundiCardProps) {
  const initials = fundi.name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const cardId = fundi.name.trim().replace(/\s+/g, "-")
  const profileLink = `/fundis/${encodeURIComponent(cardId)}`

  return (
    <Card 
      id={cardId}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.99] active:bg-muted/20 scroll-mt-24"
    >
      <Link href={profileLink} className="block cursor-pointer focus:outline-hidden">
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-bold text-primary"
            >
              {fundi.category}
            </Badge>
            {(fundi.premiumLevel === "top" || fundi.premiumLevel === "verified") && (
              <Badge variant="outline" className="border-indigo-500/25 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold px-2 py-0.5 flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                Premium Partner
              </Badge>
            )}
          </div>
          <span className="text-[11px] font-black text-primary hover:underline md:hidden whitespace-nowrap">
            View Profile →
          </span>
        </div>

        {/* Profile Info Row */}
        <div className="flex items-center gap-3 border-t border-border/10 pt-3">
          <div className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted/40 shadow-xs">
            {fundi.image ? (
              <Image
                src={fundi.image}
                alt={fundi.name}
                fill
                unoptimized
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-xs font-black text-muted-foreground">{initials}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-extrabold text-foreground group-hover:text-primary transition-colors duration-200">
              {fundi.name}
            </h3>
            <p className="truncate text-xs font-semibold text-muted-foreground mt-0.5">
              {fundi.title}
            </p>
            {fundi.serviceArea && (
              <p className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground/80 mt-1">
                <MapPin className="h-3 w-3 text-primary shrink-0" />
                <span className="truncate">{fundi.serviceArea}</span>
              </p>
            )}
          </div>
        </div>

        {/* Rating and On-Call Row */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
          <div className="flex items-center gap-1 font-bold text-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{fundi.rating}</span>
            <span className="font-medium text-muted-foreground">({fundi.reviews} {fundi.reviews === 1 ? "review" : "reviews"})</span>
          </div>

          <Link
            href={`${profileLink}#reviews-section`}
            className="text-[11px] font-bold text-primary hover:underline ml-1"
          >
            • Leave Review
          </Link>

          {fundi.isEmergency && (
            <span className="ml-auto rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-500">
              24/7 Emergency
            </span>
          )}
          {fundi.isNearby && (
            <span className={cn("rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-500", !fundi.isEmergency && "ml-auto")}>
              Nearby
            </span>
          )}
        </div>

        {/* Short Biography story description */}
        {fundi.description && (
          <p className="mt-2.5 line-clamp-2 text-xs text-muted-foreground leading-normal min-h-8">
            {fundi.description}
          </p>
        )}
      </Link>

      {/* Call to actions */}
      <div className="mt-4 grid grid-cols-2 gap-2 pt-1">
        <Button
          variant="default"
          size="sm"
          className="h-9 cursor-pointer rounded-lg bg-primary text-xs font-bold shadow-2xs hover:bg-primary/95 transition-transform group-hover:scale-[1.01]"
          asChild
        >
          <a
            href={`https://wa.me/${fundi.whatsapp.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(fundi.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 cursor-pointer rounded-lg border-border/80 hover:bg-muted text-xs font-bold"
          asChild
        >
          <a href={`tel:${fundi.phone}`}>
            <Phone className="h-4 w-4" />
            Call
          </a>
        </Button>
      </div>
    </Card>
  )
}
