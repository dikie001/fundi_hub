"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { ClientProfileData, Fundi, SafeUser } from "@/lib/types"

export type DashboardContextType = {
  user: SafeUser | null
  profile: ClientProfileData | null
  isLoading: boolean
  allFundis: Fundi[]
  matchedFundis: Fundi[]
  fetchData: () => Promise<void>
  handleLogout: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null)
  const [profile, setProfile] = useState<ClientProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [allFundis, setAllFundis] = useState<Fundi[]>([])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const meRes = await fetch("/api/auth/me", { credentials: "include" })
      if (!meRes.ok) {
        window.location.href = "/auth/login"
        return
      }
      const meData = (await meRes.json()) as { user?: SafeUser }
      if (meData.user?.role === "client") {
        setUser(meData.user)
        setProfile(meData.user.clientProfile ?? null)
      } else {
        window.location.href = "/"
        return
      }

      const fundisRes = await fetch("/api/fundis")
      if (fundisRes.ok) {
        setAllFundis((await fundisRes.json()) as Fundi[])
      }
    } catch (err) {
      console.error("Client dashboard load error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/auth/login"
  }

  const clientCats = (profile?.projectCategory || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)

  // Match fundis that provide any of the requested services (union),
  // and sort by how many requested services they match (relevance).
  const matchedFundis = (() => {
    if (clientCats.length === 0) return []

    const scored = allFundis
      .map((f) => {
        const fundiSources = [f.trade, f.category, f.skills]
          .filter(Boolean)
          .join(",")
          .split(",")
          .map((s: string) => s.trim().toLowerCase())
          .filter(Boolean)

        const matchedCount = clientCats.reduce(
          (acc, cat) => acc + (fundiSources.includes(cat) ? 1 : 0),
          0
        )

        return { fundi: f, matchedCount }
      })
      .filter((s) => s.matchedCount > 0)
      .sort((a, b) => b.matchedCount - a.matchedCount)

    return scored.map((s) => s.fundi)
  })()

  return (
    <DashboardContext.Provider
      value={{
        user,
        profile,
        isLoading,
        allFundis,
        matchedFundis,
        fetchData,
        handleLogout,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx)
    throw new Error("useDashboard must be used within DashboardProvider")
  return ctx
}
