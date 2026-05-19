"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Wrench,
  Zap,
  Flame,
  Hammer,
  Paintbrush,
  Camera,
  Sun,
  Sparkles,
  Truck,
  Wifi,
} from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  Wrench: <Wrench className="h-8 w-8" />,
  Zap: <Zap className="h-8 w-8" />,
  Flame: <Flame className="h-8 w-8" />,
  Hammer: <Hammer className="h-8 w-8" />,
  Paintbrush: <Paintbrush className="h-8 w-8" />,
  Camera: <Camera className="h-8 w-8" />,
  Sun: <Sun className="h-8 w-8" />,
  Sparkles: <Sparkles className="h-8 w-8" />,
  Truck: <Truck className="h-8 w-8" />,
  Wifi: <Wifi className="h-8 w-8" />,
}

interface CategoryCardProps {
  name: string
  icon: string
  active?: boolean
  onClick?: () => void
}

export function CategoryCard({ name, icon, active, onClick }: CategoryCardProps) {
  const cardContent = (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md cursor-pointer border border-border/50",
      active ? "border-primary bg-primary/5 shadow-primary/5" : "hover:border-primary/25 bg-card"
    )}>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-6">
        <div className={cn("transition-transform duration-300", active ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary")}>
          {iconMap[icon] || <Wrench className="h-8 w-8" />}
        </div>
        <h3 className={cn("text-center text-xs font-bold transition-colors", active ? "text-primary" : "text-muted-foreground")}>{name}</h3>
      </CardContent>
    </Card>
  )

  if (onClick) {
    return (
      <div onClick={(e) => { e.preventDefault(); onClick(); }} className="outline-hidden">
        {cardContent}
      </div>
    )
  }

  return (
    <Link href={`/#categories?filter=${encodeURIComponent(name)}`} className="outline-hidden">
      {cardContent}
    </Link>
  )
}
