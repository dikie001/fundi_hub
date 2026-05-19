"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone, MapPin, Shield, Star } from "lucide-react"
import type { Fundi } from "@/lib/data"
import Image from "next/image"

interface FundiCardProps {
  fundi: Fundi
}

export function FundiCard({ fundi }: FundiCardProps) {
  const initials = fundi.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="group overflow-hidden border-border/70 bg-linear-to-b from-card via-card to-muted/20 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
      <CardHeader className="pb-3">
        <div className="mb-4 flex items-center justify-between">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-xs font-medium text-primary"
          >
            {fundi.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {fundi.reviews}+ jobs
          </span>
        </div>
        <div className="flex gap-3">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 ring-2 ring-primary/10">
            {fundi.image ? (
              <Image
                src={fundi.image}
                alt={fundi.name}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-primary">{initials}</span>
            )}
          </div>
          <div className="grow">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-lg leading-tight tracking-tight">
                  {fundi.name}
                </CardTitle>
                <CardDescription className="mt-1 text-sm">
                  {fundi.title}
                </CardDescription>
              </div>
              {fundi.premiumLevel === "top" && (
                <Badge className="flex gap-1 bg-amber-500 whitespace-nowrap text-amber-950 shadow-sm hover:bg-amber-500">
                  <Star size={12} />
                  Top Verified
                </Badge>
              )}
              {fundi.premiumLevel === "verified" && (
                <Badge className="flex gap-1 bg-sky-600 whitespace-nowrap text-white shadow-sm hover:bg-sky-600">
                  <Shield size={12} />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{fundi.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({fundi.reviews} reviews)
          </span>
          {fundi.isEmergency && (
            <Badge
              variant="outline"
              className="ml-auto border-red-500/40 bg-red-500/10 text-red-500"
            >
              24/7 Emergency
            </Badge>
          )}
          {fundi.isNearby && (
            <Badge
              variant="outline"
              className="flex gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
            >
              <MapPin size={12} />
              Nearby
            </Badge>
          )}
        </div>

        <p className="line-clamp-3 min-h-18 text-sm text-muted-foreground">
          {fundi.description}
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant="default"
            size="sm"
            className="h-10 rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-[1.01]"
            asChild
          >
            <a
              href={`https://wa.me/${fundi.whatsapp.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(fundi.name)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-primary/30 bg-background/60"
            asChild
          >
            <a href={`tel:${fundi.phone}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
