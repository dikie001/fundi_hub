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

const SKILLS_VISIBLE = 2

function VerifiedBadge() {
  return (
    <span title="Verified" className="inline-flex shrink-0 items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-[15px] w-[15px]" aria-label="Verified">
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
  const initials = fundi.name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const cardId = fundi.name.trim().replace(/\s+/g, "-")
  const profileLink = `/fundis/${encodeURIComponent(cardId)}`
  const isVerified = fundi.premiumLevel === "top" || fundi.premiumLevel === "verified"

  const allSkills = fundi.skills
    ? fundi.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : []
  const visibleSkills = allSkills.slice(0, SKILLS_VISIBLE)
  const hiddenSkills = allSkills.slice(SKILLS_VISIBLE)

  return (
    <Card
      id={cardId}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.99] active:bg-muted/20 scroll-mt-24"
    >
      <Link href={profileLink} className="block cursor-pointer focus:outline-hidden">
        {/* Top row — mobile "View Profile" link only */}
        <div className="flex items-center justify-end pb-2 md:hidden">
          <span className="text-[11px] font-black text-primary hover:underline whitespace-nowrap">
            View Profile →
          </span>
        </div>

        {/* Profile Info Row */}
        <div className="flex items-center gap-3">
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
            {/* Name + verified badge */}
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-extrabold text-foreground group-hover:text-primary transition-colors duration-200">
                {fundi.name}
              </h3>
              {isVerified && <VerifiedBadge />}
            </div>

            {/* Category under name */}
            <span className="mt-0.5 inline-block rounded-sm border border-primary/20 bg-primary/5 px-1.5 py-px text-[10px] font-bold text-primary leading-tight">
              {fundi.category}
            </span>

            {fundi.serviceArea && (
              <p className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground/80 mt-1">
                <MapPin className="h-3 w-3 text-primary shrink-0" />
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
                className="px-1.5 py-px text-[10px] font-semibold rounded-sm"
              >
                {skill}
              </Badge>
            ))}
            {hiddenSkills.length > 0 && (
              <span className="group/more relative">
                <Badge
                  variant="outline"
                  className="cursor-default px-1.5 py-px text-[10px] font-semibold rounded-sm border-dashed"
                >
                  +{hiddenSkills.length} more
                </Badge>
                {/* Hover tooltip — desktop only */}
                <span className="pointer-events-none absolute bottom-full left-0 mb-1.5 z-20 hidden md:group-hover/more:flex flex-wrap gap-1 min-w-max max-w-56 rounded-lg border border-border/60 bg-popover p-2 shadow-md">
                  {hiddenSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-1.5 py-px text-[10px] font-semibold rounded-sm"
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
        <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs">
          <div className="flex items-center gap-1 font-bold text-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{Number(fundi.rating).toFixed(1)}</span>
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

        {/* Description */}
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
