import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
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
}

export function CategoryCard({ name, icon }: CategoryCardProps) {
  return (
    <Link href={`/categories/${name.toLowerCase().replace(/\s+/g, "-")}`}>
      <Card className="transition-all hover:shadow-md">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-8">
          <div className="text-primary">{iconMap[icon] || <Wrench className="h-8 w-8" />}</div>
          <h3 className="text-center text-sm font-medium">{name}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}
