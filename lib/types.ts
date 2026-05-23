import type { ComponentType } from "react"

export type UserRole = "client" | "fundi" | "admin"
export type PremiumLevel = "none" | "verified" | "top"
export type ReferralStatus = "pending" | "registered" | "paid"

export interface ClientProfileData {
  id: string
  userId: string
  projectCategory: string | null
  projectLocation: string | null
  budgetRange: string | null
  urgency: string | null
  image: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface ReferralData {
  id: string
  refereeName: string
  refereePhone: string
  refereeTrade: string
  status: ReferralStatus
  commission: number
  createdAt?: Date
  updatedAt?: Date
}

export interface ReviewData {
  id: string
  reviewerName: string
  rating: number
  comment: string
  ip?: string | null
  createdAt?: Date | string
}

export interface FundiProfileData {
  id: string
  userId: string
  title: string
  category: string
  rating: number
  reviews: number
  jobsCompleted?: number
  successRate?: number
  jobEarnings?: number
  image: string | null
  trade: string
  yearsExperience: string
  serviceArea: string
  nationalId: string | null
  preferredContact: string
  premiumLevel: PremiumLevel
  isAvailable: boolean
  isNearby: boolean
  description: string | null
  skills: string
  portfolio: string
  createdAt?: Date
  updatedAt?: Date
  reviewsList?: ReviewData[]
}

export interface SafeUser {
  id: string
  name: string
  email: string | null
  phone: string
  role: UserRole
  image: string | null
  createdAt?: Date
  updatedAt?: Date
  fundiProfile?: FundiProfileData | null
  clientProfile?: ClientProfileData | null
  referrals?: ReferralData[]
}

export interface FundiLead {
  id: string
  clientName: string
  trade: string
  title: string
  location: string
  budget: string
  urgency: string
  description: string
  phone: string
  createdAt: string
}

export interface DashboardMenuItem {
  id: string
  label: string
  icon: ComponentType<{ className?: string }>
  badge?: number
  href: string
}

export interface GoogleProfileData {
  sub: string
  name: string
  email: string
  picture?: string
}

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
