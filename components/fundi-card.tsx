"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone, MapPin, Shield, Star } from "lucide-react"
import type { Fundi } from "@/lib/data"
import Image from "next/image"

interface FundiCardProps {
  fundi: Fundi
}

export function FundiCard({ fundi }: FundiCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex gap-3">
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={fundi.image}
              alt={fundi.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-lg">{fundi.name}</CardTitle>
                <CardDescription className="text-sm">{fundi.title}</CardDescription>
              </div>
              {fundi.premiumLevel === "top" && (
                <Badge className="flex gap-1 whitespace-nowrap bg-amber-600 hover:bg-amber-700">
                  <Star size={12} />
                  Top Verified
                </Badge>
              )}
              {fundi.premiumLevel === "verified" && (
                <Badge className="flex gap-1 whitespace-nowrap bg-blue-600 hover:bg-blue-700">
                  <Shield size={12} />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{fundi.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({fundi.reviews} reviews)</span>
          {fundi.isEmergency && (
            <Badge variant="outline" className="ml-auto text-red-600">
              24/7 Emergency
            </Badge>
          )}
          {fundi.isNearby && (
            <Badge variant="outline" className="flex gap-1">
              <MapPin size={12} />
              Nearby
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{fundi.description}</p>

        <div className="flex gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
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
            className="flex-1"
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
