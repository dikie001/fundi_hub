export interface Fundi {
  id: string
  name: string
  title: string
  category: string
  trade?: string
  yearsExperience?: string
  rating: number
  reviews: number
  image: string
  phone: string
  whatsapp: string
  verified: boolean
  premiumLevel: "none" | "verified" | "top"
  isAvailable: boolean
  isNearby: boolean
  description: string
  serviceArea?: string
  skills?: string
}
