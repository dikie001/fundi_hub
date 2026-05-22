"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone, Star, MapPin, User } from "lucide-react"
import type { Fundi } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface FundiCardProps {
  fundi: Fundi
}

const SKILLS_VISIBLE = 2

function VerifiedBadge() {
  return (
    <span
      title="Verified"
      className="inline-flex shrink-0 items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-[15px] w-[15px]"
        aria-label="Verified"
      >
        <path
          d="M12 1L14.39 3.55L17.73 2.27L18.73 5.73L22.27 6.27L21.73 9.95L24 12L21.73 14.05L22.27 17.73L18.73 18.27L17.73 21.73L14.39 20.45L12 23L9.61 20.45L6.27 21.73L5.27 18.27L1.73 17.73L2.27 14.05L0 12L2.27 9.95L1.73 6.27L5.27 5.73L6.27 2.27L9.61 3.55Z"
          fill="#1877F2"
        />
        <path
          d="M7.5 12.5l3 3 6-6"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  )
}

export function FundiCard({ fundi }: FundiCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const cardId = fundi.name.trim().replace(/\s+/g, "-")
  const profileLink = `/fundis/${encodeURIComponent(cardId)}`
  const isVerified =
    fundi.premiumLevel === "top" || fundi.premiumLevel === "verified"

  const allSkills = fundi.skills
    ? fundi.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  const visibleSkills = allSkills.slice(0, SKILLS_VISIBLE)
  const hiddenSkills = allSkills.slice(SKILLS_VISIBLE)

  return (
    <Card
      id={cardId}
      className="group relative flex scroll-mt-24 flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.99] active:bg-muted/20"
    >
      <Link
        href={profileLink}
        className="block cursor-pointer focus:outline-hidden"
      >
        {/* Top row — mobile "View Profile" link only */}
        <div className="flex items-center justify-end pb-2 md:hidden">
          <span className="text-[11px] font-black whitespace-nowrap text-primary hover:underline">
            View Profile →
          </span>
        </div>

        {/* Profile Info Row */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/40 bg-muted/40 shadow-xs">
            {fundi.image && !imageError ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 animate-pulse rounded-full bg-muted" />
                )}
                <Image
                  src={fundi.image}
                  alt={fundi.name}
                  fill
                  unoptimized
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className={cn(
                    "rounded-full object-cover transition-opacity duration-200",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                />
              </>
            ) : (
              <User className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            {/* Name + verified badge */}
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-extrabold text-foreground transition-colors duration-200 group-hover:text-primary">
                {fundi.name}
              </h3>
              {isVerified && <VerifiedBadge />}
            </div>

            {/* Category under name */}
            <span className="mt-0.5 inline-block rounded-sm border border-primary/20 bg-primary/5 px-1.5 py-px text-[10px] leading-tight font-bold text-primary">
              {fundi.category}
            </span>

            {fundi.serviceArea && (
              <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-muted-foreground/80">
                <MapPin className="h-3 w-3 shrink-0 text-primary" />
                <span className="truncate">{fundi.serviceArea}</span>
              </p>
            )}
          </div>
        </div>

        {/* Skills row */}
        {allSkills.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1">
            {visibleSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="rounded-sm px-1.5 py-px text-[10px] font-semibold"
              >
                {skill}
              </Badge>
            ))}
            {hiddenSkills.length > 0 && (
              <span className="group/more relative">
                <Badge
                  variant="outline"
                  className="cursor-default rounded-sm border-dashed px-1.5 py-px text-[10px] font-semibold"
                >
                  +{hiddenSkills.length} more
                </Badge>
                {/* Hover tooltip — desktop only */}
                <span className="pointer-events-none absolute bottom-full left-0 z-20 mb-1.5 hidden max-w-56 min-w-max flex-wrap gap-1 rounded-lg border border-border/60 bg-popover p-2 shadow-md md:group-hover/more:flex">
                  {hiddenSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="rounded-sm px-1.5 py-px text-[10px] font-semibold"
                    >
                      {skill}
                    </Badge>
                  ))}
                </span>
              </span>
            )}
          </div>
        )}

        {/* Rating row */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 font-bold text-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>
              {fundi.rating ? Number(fundi.rating).toFixed(1) : "0.0"}
            </span>
          </div>

          <Link
            href={`${profileLink}#reviews-section`}
            className="ml-1 text-[11px] font-bold text-primary hover:underline"
          >
            • Leave Review
          </Link>

          {fundi.isNearby && (
            <span className="ml-auto rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-500">
              Nearby
            </span>
          )}
        </div>

        {/* Description */}
        {fundi.description && (
          <p className="mt-2.5 line-clamp-2 min-h-8 text-xs leading-normal text-muted-foreground">
            {fundi.description}
          </p>
        )}
      </Link>

      {/* Call to actions */}
      <div className="mt-4 grid grid-cols-2 gap-2 pt-1">
        <Button
          variant="default"
          size="sm"
          className="h-9 cursor-pointer rounded-lg bg-primary text-xs font-bold shadow-2xs transition-transform group-hover:scale-[1.01] hover:bg-primary/95"
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
          className="h-9 cursor-pointer rounded-lg border-border/80 text-xs font-bold hover:bg-muted"
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
