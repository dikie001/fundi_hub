"use client"

import { useEffect, useState } from "react"
import {
  AlertCircle,
  Briefcase,
  Camera,
  Check,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  FileCheck,
  FolderKanban,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  MapPin,
  MessageSquare,
  PenLine,
  Phone,
  Plus,
  Shield,
  ShieldCheck,
  Star,
  Trash2,
  TrendingUp,
  Wrench,
  Zap,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { OverviewTab } from "./components/overview-tab"

type PortfolioItem = {
  id: string
  title: string
  category: string
  image: string
}

type Lead = {
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

function DashboardInner() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState("")
  const [copiedReferral, setCopiedReferral] = useState(false)
  const [mounted, setMounted] = useState(false)
  const setTheme = () => {}
  const resolvedTheme = "light"

  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "profile" | "referrals" | "membership">("overview")
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [appliedLeadIds, setAppliedLeadIds] = useState<string[]>([])
  const [archivedLeadIds, setArchivedLeadIds] = useState<string[]>([])

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const [premiumModalType, setPremiumModalType] = useState<"verified" | "top">("verified")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const [editName, setEditName] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editTrade, setEditTrade] = useState("")
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
  const [uploadFileName, setUploadFileName] = useState("")
  const [uploadFileSize, setUploadFileSize] = useState("")

  useEffect(() => {
    setMounted(true)
    const appIds = localStorage.getItem("applied_leads")
    const arcIds = localStorage.getItem("archived_leads")
    if (appIds) setAppliedLeadIds(JSON.parse(appIds))
    if (arcIds) setArchivedLeadIds(JSON.parse(arcIds))
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (!response.ok) {
        window.location.href = "/auth/login"
        return
      }

      const data = await response.json()
      if (!data.user || data.user.role !== "fundi") {
        window.location.href = "/"
        return
      }

      setUser(data.user)
      setProfile(data.user.fundiProfile)
      setEditName(data.user.name || "")
      setEditTitle(data.user.fundiProfile?.title || "")
      setEditTrade(data.user.fundiProfile?.trade || "")
      setEditYearsExp(data.user.fundiProfile?.yearsExperience || "")
      setEditArea(data.user.fundiProfile?.serviceArea || "")
      setEditDesc(data.user.fundiProfile?.description || "")
      setPreferredContact(data.user.fundiProfile?.preferredContact || "whatsapp")
      setAvatarUrl(data.user.fundiProfile?.image || "")
      setSkills(
        typeof data.user.fundiProfile?.skills === "string"
          ? data.user.fundiProfile.skills.split(",").map((item: string) => item.trim()).filter(Boolean)
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
      const data = await response.json()
      const deletedList = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("deleted_leads") || "[]") : []
      setLeads((Array.isArray(data) ? data : []).filter((lead: Lead) => !deletedList.includes(lead.id)))
    } catch (error) {
      console.error("Failed to fetch matching leads:", error)
    }
  }

  useEffect(() => {
    fetchProfile()
    fetchLeads()
  }, [])

  const handleToggleEmergency = async (currentVal: boolean) => {
    if (!profile) return
    try {
      setProfile((prev: any) => ({ ...prev, isEmergency: !currentVal }))
      await fetch("/api/fundi/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEmergency: !currentVal }),
      })
    } catch (error) {
      console.error("Failed to toggle emergency status:", error)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateSuccess("")

    try {
      const response = await fetch("/api/fundi/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          title: editTitle,
          trade: editTrade,
          yearsExperience: editYearsExp,
          serviceArea: editArea,
          description: editDesc,
          preferredContact,
          skills: skills.join(", "),
        }),
      })

      if (response.ok) {
        setUpdateSuccess("Profile details saved successfully!")
        await fetchProfile()
        setTimeout(() => setUpdateSuccess(""), 4000)
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update profile details.")
      }
    } catch (error) {
      console.error("Error updating profile details:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const base64String = event.target?.result as string
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64String, fileName: file.name, folder: "fundi_hub/profile_pics" }),
        })
        if (!uploadResponse.ok) throw new Error("Upload failed")
        const uploadData = await uploadResponse.json()
        const imageUrl = uploadData.url || uploadData.data?.url || ""
        if (!imageUrl) throw new Error("No image URL returned")
        await fetch("/api/fundi/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageUrl }),
        })
        setAvatarUrl(imageUrl)
        await fetchProfile()
      } catch (error) {
        console.error("Avatar upload failed:", error)
      }
    }
    reader.readAsDataURL(file)
  }

  const handlePortfolioUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPortfolioTitle.trim()) return

    setIsPortfolioUploading(true)
    setPortfolioProgress(0)
    setUploadFileName(portfolioFile ? portfolioFile.name : `${newPortfolioTitle.toLowerCase().replace(/\s+/g, "_")}.jpg`)
    setUploadFileSize(portfolioFile ? `${(portfolioFile.size / 1024 / 1024).toFixed(2)} MB` : "No file selected")

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
                body: JSON.stringify({ image: base64String, fileName: portfolioFile.name, folder: "fundi_hub/portfolio" }),
              })
              if (!uploadResponse.ok) throw new Error("Portfolio image upload failed")
              const uploadData = await uploadResponse.json()
              await finalizeUpload(uploadData.url || "")
            } catch (error) {
              console.error("Portfolio upload failed:", error)
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
    const deletedList = JSON.parse(localStorage.getItem("deleted_leads") || "[]")
    localStorage.setItem("deleted_leads", JSON.stringify([...deletedList, leadId]))
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId))
  }

  const handleActivateBadge = async () => {
    setIsProcessingPayment(true)
    try {
      const response = await fetch("/api/fundi/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ premiumLevel: premiumModalType }),
      })
      if (response.ok) {
        setIsPremiumModalOpen(false)
        await fetchProfile()
      }
    } catch (error) {
      console.error("Error upgrading premium tier:", error)
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

  const matchingLeads = leads.filter((lead) => !appliedLeadIds.includes(lead.id) && !archivedLeadIds.includes(lead.id))
  const appliedLeads = leads.filter((lead) => appliedLeadIds.includes(lead.id))
  const archivedLeads = leads.filter((lead) => archivedLeadIds.includes(lead.id))

  const referralCount = user?.referrals?.length || 0
  const referralEarnings = referralCount * 100
  const jobEarnings = 0
  const totalEarnings = referralEarnings + jobEarnings

  const completionScore = [editName, editTitle, editTrade, editYearsExp, editArea, editDesc, preferredContact, avatarUrl, portfolioItems.length > 0]
    .filter(Boolean).length * 10

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, badge: matchingLeads.length },
    { id: "leads", label: "Client Leads", icon: Wrench, badge: matchingLeads.length },
    { id: "profile", label: "Profile & Portfolio", icon: FolderKanban },
    { id: "referrals", label: "Referrals & Rewards", icon: DollarSign },
    { id: "membership", label: "Membership Benefits", icon: ShieldCheck },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-screen animate-pulse flex-col items-center justify-center gap-3.5 bg-radial from-background to-muted text-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs font-medium text-muted-foreground">Loading your profile...</p>
      </div>
    )
  }

  return (
    <>
      <DashboardSidebar
        isCollapsed={isCollapsed}
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        mounted={mounted}
        resolvedTheme={resolvedTheme}
        setTheme={setTheme}
        handleToggleEmergency={handleToggleEmergency}
        handleLogout={handleLogout}
      />

      <SidebarInset className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-card/85 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <h2 className="text-sm font-medium text-muted-foreground capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-border/10 bg-muted/40 p-1.5 px-2.5">
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-linear-to-br from-primary to-orange-500 text-xs font-black text-white shadow-xs">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="hidden text-xs font-bold text-foreground sm:inline">{user?.name}</span>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl grow px-6 py-8">
          {activeTab === "overview" && (
            <OverviewTab
              user={user}
              profile={profile}
              matchingLeads={matchingLeads}
              completionScore={completionScore}
              totalEarnings={totalEarnings}
              referralEarnings={referralEarnings}
              jobEarnings={jobEarnings}
              setActiveTab={setActiveTab}
              openPremiumModal={(type: "verified" | "top") => {
                setPremiumModalType(type)
                setIsPremiumModalOpen(true)
              }}
              portfolioItems={portfolioItems}
              setIsAddPortfolioOpen={setIsAddPortfolioOpen}
              copyReferralLink={copyReferralLink}
              copiedReferral={copiedReferral}
            />
          )}

          {activeTab === "leads" && (
            <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-extrabold text-foreground">Client Lead Matches</h1>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Review, apply, and contact clients looking for {profile?.trade || "General"} services.
                  </p>
                </div>
                <div className="flex gap-1.5 self-start rounded-xl border border-border/20 bg-muted/40 p-1 sm:self-center">
                  {[
                    ["matching", `Matching (${matchingLeads.length})`],
                    ["applied", `Applied (${appliedLeads.length})`],
                    ["archived", `Archived (${archivedLeads.length})`],
                  ].map(([tab, label]) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab("leads")}
                      className="cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-black uppercase text-muted-foreground transition-all hover:text-foreground"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {matchingLeads.length > 0 ? matchingLeads.map((lead) => (
                  <Card key={lead.id} className="flex flex-col justify-between overflow-hidden border-border bg-card shadow-2xs transition-colors hover:border-primary/45">
                    <div>
                      <CardHeader className="border-b border-border/30 bg-muted/15 px-5 py-4 pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-black text-primary uppercase">{lead.trade}</span>
                              <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {lead.createdAt}</span>
                            </div>
                            <CardTitle className="mt-2 text-sm font-black tracking-tight text-foreground">{lead.title}</CardTitle>
                          </div>
                          <span className="shrink-0 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-black text-emerald-500">{lead.budget}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 p-5">
                        <p className="text-xs leading-normal text-muted-foreground">{lead.description}</p>
                        <div className="grid grid-cols-2 gap-3 border-t border-border/20 pt-3 text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4 shrink-0 text-primary" /><span className="truncate">{lead.location}</span></div>
                          <div className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="h-4 w-4 shrink-0 text-primary" /><span className="truncate">{lead.urgency}</span></div>
                        </div>
                      </CardContent>
                    </div>
                    <div className="flex flex-col justify-between gap-4 border-t border-border/25 bg-muted/10 p-5 sm:flex-row sm:items-center">
                      <div className="text-xs text-muted-foreground">Client: <span className="font-bold text-foreground">{lead.clientName}</span></div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleArchiveLead(lead.id)} className="h-8 cursor-pointer rounded-lg px-3 text-[11px] font-bold">Archive</Button>
                        <Button size="sm" onClick={() => handleApplyLead(lead.id)} className="h-8 cursor-pointer rounded-lg px-3 text-[11px] font-bold">Apply Now</Button>
                      </div>
                    </div>
                  </Card>
                )) : (
                  <Card className="border-border bg-card/30 p-12 text-center shadow-2xs">
                    <AlertCircle className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />
                    <h3 className="text-sm font-bold text-foreground">No leads in matching</h3>
                    <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
                      We match incoming projects based on your skill category ({profile?.trade || "General"}). Once a client submits a request, it will appear here.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div>
                  <h1 className="text-xl font-extrabold text-foreground">Profile & Portfolio</h1>
                  <p className="mt-0.5 text-sm text-muted-foreground">Manage your public profile and portfolio showcase.</p>
                </div>
              </div>

              <Card className="border border-border/40 bg-card p-6 shadow-xs">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
                    <div className="group relative h-20 w-20 shrink-0">
                      <input type="file" id="avatar-upload-profile" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      <label htmlFor="avatar-upload-profile" className="absolute inset-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-border bg-linear-to-br from-primary to-orange-500 text-2xl font-extrabold text-white shadow-sm transition-all hover:border-primary hover:shadow-md">
                        {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-all group-hover:bg-black/40"><Camera className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" /></div>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-start">
                        <h2 className="text-xl font-extrabold text-foreground">{editName || user?.name || "Fundi Partner"}</h2>
                        {profile?.premiumLevel !== "none" && <ShieldCheck className="h-4.5 w-4.5 text-blue-500" />}
                      </div>
                      <p className="text-sm font-semibold text-foreground">{editTitle || `${editTrade || "General"} Specialist`}</p>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
                        <span className="inline-flex items-center rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{editTrade || "General"}</span>
                        <span className="inline-flex items-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500">{editYearsExp || "0"} Years Experience</span>
                        <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-500"><Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {profile?.rating?.toFixed(1) || "5.0"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full justify-center md:w-auto md:justify-end">
                    <Button onClick={() => setIsPremiumModalOpen(true)} variant="outline" className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border-border/60 px-4 text-sm font-semibold shadow-xs hover:bg-muted md:w-auto"><PenLine className="h-4 w-4" /> Edit Profile</Button>
                  </div>
                </div>
              </Card>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="space-y-4 border border-border/40 bg-card p-6">
                  <div className="flex items-center justify-between border-b border-border/30 pb-3">
                    <h3 className="text-sm font-bold text-foreground">Identity & Scope</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-muted-foreground">Service Coverage</span>
                      <p className="flex items-center gap-2 text-sm font-medium text-foreground"><MapPin className="h-4 w-4 text-primary" />{editArea || "Not specified"}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-muted-foreground">Preferred Contact</span>
                      <p className="flex items-center gap-2 text-sm font-medium text-foreground capitalize"><MessageSquare className="h-4 w-4 text-primary" />{preferredContact || "whatsapp"}</p>
                    </div>
                  </div>
                </Card>

                <Card className="space-y-4 border border-border/40 bg-card p-6 md:col-span-2">
                  <div className="flex items-center justify-between border-b border-border/30 pb-3">
                    <h3 className="text-sm font-bold text-foreground">Bio Story & Skills</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-desc" className="text-sm font-semibold text-foreground">Professional Bio</Label>
                      <textarea id="edit-desc" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="flex min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/10" />
                    </div>
                    <div className="space-y-2 pt-1">
                      <Label className="text-sm font-semibold text-foreground">Specializations</Label>
                      <div className="flex flex-wrap gap-2">{skills.map((tag) => <span key={tag} className="inline-flex items-center rounded border border-border/30 bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{tag}</span>)}</div>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="border border-border/40 bg-card">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/25 px-6 py-4">
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">Works Showcase Portfolio ({portfolioItems.length})</CardTitle>
                    <CardDescription className="mt-0.5 text-sm text-muted-foreground">Real photos of recent customer repairs and installations you completed.</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setIsAddPortfolioOpen(true)} className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg text-xs font-semibold"><Plus className="h-4 w-4" /> Add Project</Button>
                </CardHeader>
                <CardContent className="p-6">
                  {portfolioItems.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {portfolioItems.map((item) => (
                        <div key={item.id} className="group relative aspect-video overflow-hidden rounded-xl border border-border/30 bg-muted/20 shadow-xs">
                          {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" /> : <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted via-background to-muted/30 text-muted-foreground"><ImageIcon className="h-8 w-8" /></div>}
                          <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/10 to-transparent p-3.5">
                            <span className="text-xs font-semibold tracking-wider text-primary uppercase">{item.category}</span>
                            <h5 className="truncate text-sm font-bold text-white">{item.title}</h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border/40 bg-muted/10 p-8 text-center">
                      <ImageIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No portfolio photos uploaded.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="flex flex-col justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary"><CheckCircle2 className="h-5 w-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Guided Profile Builder</h4>
                    <p className="text-sm text-muted-foreground">Your profile completion score is {completionScore}%. Complete all details to boost your matching priority.</p>
                  </div>
                </div>
                <Button onClick={() => setIsAddPortfolioOpen(true)} size="sm" className="h-10 cursor-pointer rounded-lg px-4 text-sm">Complete Profile Setup</Button>
              </Card>
            </div>
          )}

          {activeTab === "referrals" && (
            <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
              <div className="border-b border-border/40 pb-4">
                <h1 className="text-xl font-extrabold text-foreground">Referrals & Rewards</h1>
                <p className="mt-0.5 text-xs text-muted-foreground">Monitor your invite lists, copy registration links, and track your wallet payout statistics.</p>
              </div>
              <Card className="border border-border/40 bg-card p-6">Use the referral link in Overview to invite partners. You currently have {referralCount} referrals and KES {referralEarnings} earned.</Card>
            </div>
          )}

          {activeTab === "membership" && (
            <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
              <div className="border-b border-border/40 pb-4">
                <h1 className="text-xl font-extrabold text-foreground">Membership & Boost Tiers</h1>
                <p className="mt-0.5 text-xs text-muted-foreground">Upgrade your profile tier package to build massive customer trust and listing priority.</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border border-border/40 bg-card">
                  <CardHeader><CardTitle>Verified Badge</CardTitle><CardDescription>Get verified instantly and earn consumer trust.</CardDescription></CardHeader>
                  <CardContent><Button onClick={() => { setPremiumModalType("verified"); setIsPremiumModalOpen(true) }} className="w-full">Activate Verified Tick</Button></CardContent>
                </Card>
                <Card className="border border-border/40 bg-card">
                  <CardHeader><CardTitle>Top-Rank Verified Elite</CardTitle><CardDescription>Propel your card to top results.</CardDescription></CardHeader>
                  <CardContent><Button onClick={() => { setPremiumModalType("top"); setIsPremiumModalOpen(true) }} className="w-full">Upgrade to Top Partner</Button></CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>

      <Dialog open={isAddPortfolioOpen} onOpenChange={setIsAddPortfolioOpen}>
        <DialogContent className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">Add Portfolio Work</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Showcase pictures of jobs you did recently to attract clients.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePortfolioUpload} className="mt-2 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="port-title" className="text-sm font-semibold text-foreground">Project Title</Label>
              <Input id="port-title" value={newPortfolioTitle} onChange={(e) => setNewPortfolioTitle(e.target.value)} placeholder="e.g. Master kitchen plumbing" required className="h-10 rounded-lg text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="port-cat" className="text-sm font-semibold text-foreground">Work Category</Label>
              <select id="port-cat" value={newPortfolioCategory} onChange={(e) => setNewPortfolioCategory(e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-hidden dark:bg-card">
                <option value="Wiring">Electrical Wiring</option>
                <option value="Installation">Equipment Installation</option>
                <option value="Repair">Trouble Repair</option>
                <option value="Piping">Plumbing Piping</option>
                <option value="General">Other Works</option>
              </select>
            </div>
            <div className="rounded-lg border border-dashed border-border/40 bg-muted/15 p-5 text-center">
              <input type="file" id="portfolio-upload-file" accept="image/*" className="hidden" onChange={(e) => setPortfolioFile(e.target.files?.[0] || null)} />
              <label htmlFor="portfolio-upload-file" className="block cursor-pointer">
                <ImageIcon className="mx-auto mb-1.5 h-7 w-7 text-primary" />
                <p className="text-sm font-semibold text-foreground">{portfolioFile ? portfolioFile.name : "Select photo of your work"}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{portfolioFile ? `${(portfolioFile.size / 1024 / 1024).toFixed(2)} MB` : "PNG, JPG up to 5MB"}</p>
              </label>
            </div>
            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border/30 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsAddPortfolioOpen(false)} className="h-10 cursor-pointer rounded-lg px-4 text-sm">Cancel</Button>
              <Button type="submit" className="h-10 cursor-pointer rounded-lg px-4 text-sm font-semibold" disabled={isPortfolioUploading}>{isPortfolioUploading ? `Uploading ${portfolioProgress}%` : "Save Work"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPremiumModalOpen} onOpenChange={setIsPremiumModalOpen}>
        <DialogContent className="w-full max-w-sm rounded-lg border border-border bg-card p-5 shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1.5 text-sm font-bold text-foreground"><Zap className="h-4 w-4 animate-pulse text-primary" /> Activate Visibility Tier</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Boost your profile discovery rating and gain customer trust.</DialogDescription>
          </DialogHeader>
          <div className="my-2 space-y-4 border-t border-b border-border/30 py-4">
            <div className="space-y-1.5 rounded-lg border border-border/40 bg-muted/40 p-3.5 text-center">
              <span className="text-[9px] font-black tracking-wider text-muted-foreground uppercase">{premiumModalType === "verified" ? "Verified Trust Tick" : "Top & Verified Tier"}</span>
              <div className="text-2xl font-black text-primary">{premiumModalType === "verified" ? "Ksh 300 / mo" : "Ksh 500 / mo"}</div>
              <p className="text-xs leading-normal text-muted-foreground">{premiumModalType === "verified" ? "Displays a verified trust tick icon on your profile search card, building immediate credibility." : "Propels your profile listing to the top of category searches, giving you 5x more customer leads."}</p>
            </div>
            <div className="space-y-2 rounded-lg border border-primary/10 bg-primary/5 p-3 text-xs leading-normal text-muted-foreground">
              <div className="flex gap-1.5"><Check className="h-3.5 w-3.5 shrink-0 text-primary" /><span>Immediate badge activation on profile search</span></div>
              <div className="flex gap-1.5"><Check className="h-3.5 w-3.5 shrink-0 text-primary" /><span>Cancel or pause your subscription badge any time</span></div>
            </div>
          </div>
          <DialogFooter className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsPremiumModalOpen(false)} className="h-9.5 cursor-pointer rounded-lg px-4 text-xs text-muted-foreground">Cancel</Button>
            <Button type="button" onClick={handleActivateBadge} disabled={isProcessingPayment} className="h-9.5 cursor-pointer rounded-lg px-4 text-xs font-bold">{isProcessingPayment ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Activating...</> : "Pay & Activate"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function FundiDashboard() {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardInner />
    </SidebarProvider>
  )
}
