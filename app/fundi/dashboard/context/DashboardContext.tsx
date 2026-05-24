"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { FundiLead, FundiProfileData, SafeUser } from "@/lib/types"

export type PortfolioItem = {
  id: string
  title: string
  category: string
  image: string
}

export type Lead = {
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

type DashboardContextType = {
  user: SafeUser | null
  profile: FundiProfileData | null
  isLoading: boolean
  isUpdating: boolean
  isAvatarUploading: boolean
  updateSuccess: string
  updateError: string
  copiedReferral: boolean
  mounted: boolean
  portfolioItems: PortfolioItem[]
  leads: Lead[]
  appliedLeadIds: string[]
  archivedLeadIds: string[]
  isPremiumModalOpen: boolean
  setIsPremiumModalOpen: (open: boolean) => void
  isProcessingPayment: boolean
  setIsProcessingPayment: (processing: boolean) => void
  isAvailabilityDialogOpen: boolean
  setIsAvailabilityDialogOpen: (open: boolean) => void
  pendingAvailabilityValue: boolean
  confirmAvailabilityChange: () => Promise<void>
  editName: string
  setEditName: (name: string) => void
  editTitle: string
  setEditTitle: (title: string) => void
  editTrades: string[]
  setEditTrades: React.Dispatch<React.SetStateAction<string[]>>
  editYearsExp: string
  setEditYearsExp: (exp: string) => void
  editArea: string
  setEditArea: (area: string) => void
  editDesc: string
  setEditDesc: (desc: string) => void
  preferredContact: string
  setPreferredContact: (pref: string) => void
  avatarUrl: string
  skills: string[]
  setSkills: React.Dispatch<React.SetStateAction<string[]>>
  isAddPortfolioOpen: boolean
  setIsAddPortfolioOpen: (open: boolean) => void
  newPortfolioTitle: string
  setNewPortfolioTitle: (title: string) => void
  newPortfolioCategory: string
  setNewPortfolioCategory: (cat: string) => void
  portfolioFile: File | null
  setPortfolioFile: (file: File | null) => void
  isPortfolioUploading: boolean
  portfolioProgress: number
  matchingLeads: Lead[]
  appliedLeads: Lead[]
  archivedLeads: Lead[]
  referralCount: number
  referralEarnings: number
  jobEarnings: number
  totalEarnings: number
  completionScore: number
  fetchProfile: () => Promise<void>
  fetchLeads: () => Promise<void>
  handleToggleAvailability: (currentVal: boolean) => Promise<void>
  handleUpdateProfile: (e: React.FormEvent) => Promise<boolean>
  handleAvatarUpload: (file: File) => Promise<boolean>
  handlePortfolioUpload: (e: React.FormEvent) => void
  handleApplyLead: (leadId: string) => void
  handleArchiveLead: (leadId: string) => void
  handleRestoreLead: (leadId: string) => void
  handleDeleteLeadPermanently: (leadId: string) => void
  handleActivateBadge: (paymentReference: string) => Promise<void>
  copyReferralLink: () => void
  handleLogout: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
)

function parsePortfolioItems(portfolio: unknown): PortfolioItem[] {
  if (typeof portfolio !== "string" || !portfolio.trim()) return []
  try {
    const parsed = JSON.parse(portfolio)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item) => ({
        id: String(item?.id || `port-${Date.now()}`),
        title: String(item?.title || "Untitled work"),
        category: String(item?.category || "General"),
        image: String(item?.image || ""),
      }))
      .filter((item) => item.title.trim())
  } catch {
    return []
  }
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null)
  const [profile, setProfile] = useState<FundiProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAvatarUploading, setIsAvatarUploading] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState("")
  const [updateError, setUpdateError] = useState("")
  const [copiedReferral, setCopiedReferral] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [appliedLeadIds, setAppliedLeadIds] = useState<string[]>([])
  const [archivedLeadIds, setArchivedLeadIds] = useState<string[]>([])

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] =
    useState(false)
  const [pendingAvailabilityValue, setPendingAvailabilityValue] =
    useState(false)

  const [editName, setEditName] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editTrades, setEditTrades] = useState<string[]>([])
  const [editYearsExp, setEditYearsExp] = useState("")
  const [editArea, setEditArea] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [preferredContact, setPreferredContact] = useState("whatsapp")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [skills, setSkills] = useState<string[]>([])

  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false)
  const [newPortfolioTitle, setNewPortfolioTitle] = useState("")
  const [newPortfolioCategory, setNewPortfolioCategory] = useState("General")
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null)
  const [isPortfolioUploading, setIsPortfolioUploading] = useState(false)
  const [portfolioProgress, setPortfolioProgress] = useState(0)

  const showSuccess = (message: string) => {
    setUpdateError("")
    setUpdateSuccess(message)
    setTimeout(() => setUpdateSuccess(""), 4000)
  }

  const showError = (message: string) => {
    setUpdateSuccess("")
    setUpdateError(message)
  }

  useEffect(() => {
    setMounted(true)
    const appIds = localStorage.getItem("applied_leads")
    const arcIds = localStorage.getItem("archived_leads")
    if (appIds) setAppliedLeadIds(JSON.parse(appIds))
    if (arcIds) setArchivedLeadIds(JSON.parse(arcIds))
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" })
      if (!response.ok) {
        window.location.href = "/auth/login"
        return
      }

      const data = (await response.json()) as { user: SafeUser }
      if (!data.user || data.user.role !== "fundi") {
        window.location.href = "/"
        return
      }

      setUser(data.user)
      setProfile(data.user.fundiProfile ?? null)
      setEditName(data.user.name || "")
      setEditTitle(data.user.fundiProfile?.title || "")
      setEditTrades(
        (data.user.fundiProfile?.trade || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      )
      setEditYearsExp(data.user.fundiProfile?.yearsExperience || "")
      setEditArea(data.user.fundiProfile?.serviceArea || "")
      setEditDesc(data.user.fundiProfile?.description || "")
      setPreferredContact(
        data.user.fundiProfile?.preferredContact || "whatsapp"
      )
      setAvatarUrl(data.user.fundiProfile?.image || "")
      setSkills(
        typeof data.user.fundiProfile?.skills === "string"
          ? data.user.fundiProfile.skills
              .split(",")
              .map((item: string) => item.trim())
              .filter(Boolean)
          : []
      )
      setPortfolioItems(parsePortfolioItems(data.user.fundiProfile?.portfolio))
    } catch (error) {
      console.error("Error fetching fundi profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/fundi/leads", { cache: "no-store" })
      if (!response.ok) return
      const data = (await response.json()) as FundiLead[]
      const deletedList =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("deleted_leads") || "[]")
          : []
      setLeads(data.filter((lead) => !deletedList.includes(lead.id)))
    } catch (error) {
      console.error("Failed to fetch matching leads:", error)
    }
  }

  useEffect(() => {
    fetchProfile()
    fetchLeads()
  }, [])

  const handleToggleAvailability = async (currentVal: boolean) => {
    if (!profile) return
    setPendingAvailabilityValue(!currentVal)
    setIsAvailabilityDialogOpen(true)
  }

  const confirmAvailabilityChange = async () => {
    if (!profile) return

    const currentVal = profile.isAvailable
    const newVal = pendingAvailabilityValue

    try {
      setProfile((prev) => (prev ? { ...prev, isAvailable: newVal } : prev))
      setIsAvailabilityDialogOpen(false)

      await fetch("/api/fundi/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: newVal }),
      })
    } catch (error) {
      console.error("Failed to toggle availability status:", error)
      // Revert on error
      setProfile((prev) => (prev ? { ...prev, isAvailable: currentVal } : prev))
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateSuccess("")
    setUpdateError("")

    try {
      const response = await fetch("/api/fundi/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          title: editTitle,
          trade: editTrades.join(","),
          yearsExperience: editYearsExp,
          serviceArea: editArea,
          description: editDesc,
          preferredContact,
          skills: skills.join(", "),
        }),
      })

      if (response.ok) {
        showSuccess("Profile details saved successfully!")
        await fetchProfile()
        return true
      } else {
        const data = (await response.json()) as { error?: string }
        showError(data.error || "Failed to update profile details.")
        return false
      }
    } catch (error) {
      console.error("Error updating profile details:", error)
      showError("Unable to save profile details. Please try again.")
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showError("Image must be 5 MB or smaller.")
      return false
    }

    setIsAvatarUploading(true)
    setUpdateSuccess("")
    setUpdateError("")

    try {
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => resolve((event.target?.result as string) || "")
        reader.onerror = () => reject(new Error("Unable to read image file"))
        reader.readAsDataURL(file)
      })

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64String,
          fileName: file.name,
          folder: "fundi_hub/profile_pics",
        }),
      })

      if (!uploadResponse.ok) {
        throw new Error("Upload failed")
      }

      const uploadData = await uploadResponse.json()
      const imageUrl = uploadData.url || uploadData.data?.url || ""

      if (!imageUrl) {
        throw new Error("No image URL returned")
      }

      const profileResponse = await fetch("/api/fundi/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageUrl }),
      })

      if (!profileResponse.ok) {
        throw new Error("Failed to save profile image")
      }

      setAvatarUrl(imageUrl)
      await fetchProfile()
      showSuccess("Profile photo updated successfully!")
      return true
    } catch (error) {
      console.error("Avatar upload failed:", error)
      showError("Failed to upload profile photo. Please try again.")
      return false
    } finally {
      setIsAvatarUploading(false)
    }
  }

  const handlePortfolioUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPortfolioTitle.trim()) return

    setIsPortfolioUploading(true)
    setUpdateError("")
    setPortfolioProgress(0)

    const finalizeUpload = async (imgUrl: string) => {
      const newItem = {
        id: `port-${Date.now()}`,
        title: newPortfolioTitle,
        category: newPortfolioCategory,
        image: imgUrl,
      }

      const updatedItems = [newItem, ...portfolioItems]
      setPortfolioItems(updatedItems)
      await fetch("/api/fundi/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio: JSON.stringify(updatedItems) }),
      })

      setNewPortfolioTitle("")
      setPortfolioFile(null)
      setIsPortfolioUploading(false)
      setIsAddPortfolioOpen(false)
      showSuccess("Portfolio item saved successfully!")
    }

    let progress = 0
    const interval = setInterval(() => {
      progress += 20
      setPortfolioProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        if (portfolioFile) {
          const reader = new FileReader()
          reader.onload = async (event) => {
            try {
              const base64String = event.target?.result as string
              const uploadResponse = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  image: base64String,
                  fileName: portfolioFile.name,
                  folder: "fundi_hub/portfolio",
                }),
              })
              if (!uploadResponse.ok)
                throw new Error("Portfolio image upload failed")
              const uploadData = await uploadResponse.json()
              await finalizeUpload(uploadData.url || "")
            } catch (error) {
              console.error("Portfolio upload failed:", error)
              showError("Portfolio upload failed. Saving without image.")
              await finalizeUpload("")
            }
          }
          reader.readAsDataURL(portfolioFile)
        } else {
          void finalizeUpload("")
        }
      }
    }, 60)
  }

  const handleApplyLead = (leadId: string) => {
    const newApplied = [...appliedLeadIds, leadId]
    setAppliedLeadIds(newApplied)
    localStorage.setItem("applied_leads", JSON.stringify(newApplied))
    const newArchived = archivedLeadIds.filter((id) => id !== leadId)
    setArchivedLeadIds(newArchived)
    localStorage.setItem("archived_leads", JSON.stringify(newArchived))
  }

  const handleArchiveLead = (leadId: string) => {
    const newArchived = [...archivedLeadIds, leadId]
    setArchivedLeadIds(newArchived)
    localStorage.setItem("archived_leads", JSON.stringify(newArchived))
    const newApplied = appliedLeadIds.filter((id) => id !== leadId)
    setAppliedLeadIds(newApplied)
    localStorage.setItem("applied_leads", JSON.stringify(newApplied))
  }

  const handleRestoreLead = (leadId: string) => {
    const newArchived = archivedLeadIds.filter((id) => id !== leadId)
    setArchivedLeadIds(newArchived)
    localStorage.setItem("archived_leads", JSON.stringify(newArchived))
    const newApplied = appliedLeadIds.filter((id) => id !== leadId)
    setAppliedLeadIds(newApplied)
    localStorage.setItem("applied_leads", JSON.stringify(newApplied))
  }

  const handleDeleteLeadPermanently = (leadId: string) => {
    const deletedList = JSON.parse(
      localStorage.getItem("deleted_leads") || "[]"
    )
    localStorage.setItem(
      "deleted_leads",
      JSON.stringify([...deletedList, leadId])
    )
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId))
  }

  const handleActivateBadge = async (paymentReference: string) => {
    setIsProcessingPayment(true)
    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: paymentReference,
        }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setIsPremiumModalOpen(false)
        await fetchProfile()
        alert("Premium badge activated successfully!")
      } else {
        alert(data.error || "Payment verification failed")
      }
    } catch (error) {
      console.error("Error upgrading premium tier:", error)
      alert("An error occurred while activating your badge")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const copyReferralLink = () => {
    if (!user) return
    const link = `${window.location.origin}/auth/signup?ref=${user.id}`
    navigator.clipboard.writeText(link)
    setCopiedReferral(true)
    setTimeout(() => setCopiedReferral(false), 3000)
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/auth/login"
  }

  const matchingLeads = leads.filter(
    (lead) =>
      !appliedLeadIds.includes(lead.id) && !archivedLeadIds.includes(lead.id)
  )
  const appliedLeads = leads.filter((lead) => appliedLeadIds.includes(lead.id))
  const archivedLeads = leads.filter((lead) =>
    archivedLeadIds.includes(lead.id)
  )

  const referralCount = user?.referrals?.length || 0
  const referralEarnings = referralCount * 100
  const jobEarnings = profile?.jobEarnings || 0
  const totalEarnings = referralEarnings + jobEarnings

  const completionScore =
    [
      editName,
      editTitle,
      editTrades.length > 0,
      editYearsExp,
      editArea,
      editDesc,
      preferredContact,
      avatarUrl,
      portfolioItems.length > 0,
    ].filter(Boolean).length * 10

  return (
    <DashboardContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isUpdating,
        isAvatarUploading,
        updateSuccess,
        updateError,
        copiedReferral,
        mounted,
        portfolioItems,
        leads,
        appliedLeadIds,
        archivedLeadIds,
        isPremiumModalOpen,
        setIsPremiumModalOpen,
        isProcessingPayment,
        setIsProcessingPayment,
        isAvailabilityDialogOpen,
        setIsAvailabilityDialogOpen,
        pendingAvailabilityValue,
        confirmAvailabilityChange,
        editName,
        setEditName,
        editTitle,
        setEditTitle,
        editTrades,
        setEditTrades,
        editYearsExp,
        setEditYearsExp,
        editArea,
        setEditArea,
        editDesc,
        setEditDesc,
        preferredContact,
        setPreferredContact,
        avatarUrl,
        skills,
        setSkills,
        isAddPortfolioOpen,
        setIsAddPortfolioOpen,
        newPortfolioTitle,
        setNewPortfolioTitle,
        newPortfolioCategory,
        setNewPortfolioCategory,
        portfolioFile,
        setPortfolioFile,
        isPortfolioUploading,
        portfolioProgress,
        matchingLeads,
        appliedLeads,
        archivedLeads,
        referralCount,
        referralEarnings,
        jobEarnings,
        totalEarnings,
        completionScore,
        fetchProfile,
        fetchLeads,
        handleToggleAvailability,
        handleUpdateProfile,
        handleAvatarUpload,
        handlePortfolioUpload,
        handleApplyLead,
        handleArchiveLead,
        handleRestoreLead,
        handleDeleteLeadPermanently,
        handleActivateBadge,
        copyReferralLink,
        handleLogout,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
