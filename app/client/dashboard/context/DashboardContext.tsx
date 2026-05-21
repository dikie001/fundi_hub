"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type ClientProfile = {
  id: string
  projectCategory: string | null
  projectLocation: string | null
  budgetRange: string | null
  urgency: string | null
  image: string | null
}

export type DashboardContextType = {
  user: any
  profile: ClientProfile | null
  isLoading: boolean
  allFundis: any[]
  matchedFundis: any[]
  fetchData: () => Promise<void>
  handleLogout: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [allFundis, setAllFundis] = useState<any[]>([])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const meRes = await fetch("/api/auth/me")
      if (!meRes.ok) {
        window.location.href = "/auth/login"
        return
      }
      const meData = await meRes.json()
      if (meData.user?.role === "client") {
        setUser(meData.user)
        setProfile(meData.user.clientProfile)
      } else {
        window.location.href = "/"
        return
      }

      const fundisRes = await fetch("/api/fundis")
      if (fundisRes.ok) {
        setAllFundis(await fundisRes.json())
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

  // Strict matching: a fundi must provide ALL services the client requested.
  // We consider `trade`, `category`, and `skills` fields on the fundi as sources.
  const matchedFundis = allFundis.filter((f) => {
    if (clientCats.length === 0) return false

    const fundiSources = [f.trade, f.category, f.skills]
      .filter(Boolean)
      .join(",")
      .split(",")
      .map((s: string) => s.trim().toLowerCase())
      .filter(Boolean)

    // require every requested category to be present in fundi's sources
    return clientCats.every((cat) => fundiSources.includes(cat))
  })

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
