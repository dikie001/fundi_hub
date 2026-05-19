"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  Wrench,
  Calendar,
  MapPin,
  Award,
  DollarSign,
  Clock,
  MessageSquare,
  Phone,
  User,
  LogOut,
  Star,
  ShieldCheck,
  Share2,
  Check,
  Loader2,
  Zap,
  AlertCircle,
  Briefcase,
  ExternalLink,
  Shield,
  LayoutDashboard,
  ChevronRight,
  TrendingUp,
  FolderKanban,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Sun,
  Moon,
  Download,
  Plus,
  Trash2,
  Camera,
  CheckCircle2,
  FileCheck,
  PenLine,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Static mock incoming client leads to show matching recommendations dynamically based on trade
const MOCK_CLIENT_LEADS = [
  {
    id: "lead-1",
    clientName: "David K.",
    trade: "Plumber",
    title: "Urgent Kitchen Pipe Leak",
    location: "Nairobi, Kilimani",
    budget: "KES 3,500",
    urgency: "Today / Immediate",
    description:
      "Our kitchen sink pipe has burst and water is flooding the floor. Need a plumber right away.",
    phone: "+254 712 345 678",
    createdAt: "10 mins ago",
  },
  {
    id: "lead-2",
    clientName: "Grace M.",
    trade: "Electrician",
    title: "Short Circuit in Living Room",
    location: "Nairobi, Langata",
    budget: "KES 5,000",
    urgency: "Within 3 Days",
    description:
      "Several sockets have stopped working after a spark. Need an electrician to trace the fault.",
    phone: "+254 722 890 123",
    createdAt: "45 mins ago",
  },
  {
    id: "lead-3",
    clientName: "John O.",
    trade: "Painter",
    title: "Apartment Interior Painting",
    location: "Mombasa, Nyali",
    budget: "KES 25,000",
    urgency: "Flexible / Planning",
    description:
      "Looking to repaint the interior of a 2-bedroom apartment next week. Budget is flexible.",
    phone: "+254 733 456 789",
    createdAt: "2 hours ago",
  },
  {
    id: "lead-4",
    clientName: "Carpenter",
    trade: "Carpenter",
    title: "Fix Wardrobe Hinges",
    location: "Nairobi, Westlands",
    budget: "KES 2,000",
    urgency: "Within a Week",
    description:
      "Two sliding wardrobe doors have come off their hinges and need realignment.",
    phone: "+254 701 234 567",
    createdAt: "4 hours ago",
  },
  {
    id: "lead-5",
    clientName: "Peter K.",
    trade: "Plumber",
    title: "Install Instant Shower Heater",
    location: "Nairobi, Kasarani",
    budget: "KES 1,500",
    urgency: "Within 3 Days",
    description:
      "Looking for an experienced plumber to mount and connect a brand new instant heater in bathroom.",
    phone: "+254 711 999 888",
    createdAt: "1 day ago",
  },
]

// Mock portfolio items
const INITIAL_PORTFOLIO_ITEMS = [
  {
    id: "port-1",
    title: "House Wiring Project",
    category: "Wiring",
    image:
      "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: "port-2",
    title: "Distribution Box Setup",
    category: "Installation",
    image:
      "https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=600&auto=format&fit=crop&q=60",
  },
]

function DashboardInner() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState("")
  const [copiedReferral, setCopiedReferral] = useState(false)

  // Edit profile states
  const [editName, setEditName] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editTrade, setEditTrade] = useState("")
  const [editYearsExp, setEditYearsExp] = useState("")
  const [editArea, setEditArea] = useState("")
  const [editDesc, setEditDesc] = useState("")

  // Premium Modal states
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const [premiumModalType, setPremiumModalType] = useState<"verified" | "top">(
    "verified"
  )
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Layout states
  const [activeTab, setActiveTab] = useState<
    "overview" | "leads" | "profile" | "referrals" | "membership"
  >("overview")

  // Portfolio local state
  const [portfolioItems, setPortfolioItems] = useState(INITIAL_PORTFOLIO_ITEMS)
  const [newPortfolioTitle, setNewPortfolioTitle] = useState("")
  const [newPortfolioCategory, setNewPortfolioCategory] = useState("General")
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false)

  // Profile Wizard / Completions States
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [skills, setSkills] = useState<string[]>([
    "Emergency Repair",
    "Leak Detection",
    "Pipe Installation",
  ])
  const [newSkillInput, setNewSkillInput] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarProgress, setAvatarProgress] = useState(0)
  const [isAvatarUploading, setIsAvatarUploading] = useState(false)
  const [portfolioProgress, setPortfolioProgress] = useState(0)
  const [isPortfolioUploading, setIsPortfolioUploading] = useState(false)
  const [uploadFileName, setUploadFileName] = useState("")
  const [uploadFileSize, setUploadFileSize] = useState("")
  const [preferredContact, setPreferredContact] = useState("whatsapp")

  // Leads tab interactive state
  const [leads, setLeads] = useState<any[]>([])
  const [leadsSubTab, setLeadsSubTab] = useState<
    "matching" | "applied" | "archived"
  >("matching")
  const [appliedLeadIds, setAppliedLeadIds] = useState<string[]>([])
  const [archivedLeadIds, setArchivedLeadIds] = useState<string[]>([])
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null)

  // Compute profile completeness variables at top level
  const basicInfoDone = !!(editName && editTitle && editTrade)
  const serviceAreaDone = !!(editYearsExp && editArea)
  const bioDone = !!(editDesc && editDesc.length > 10)
  const preferredContactDone = !!preferredContact
  const avatarDone = !!(avatarUrl || profile?.image)
  const portfolioDone = portfolioItems.length > 0

  const calculateCompletionScore = () => {
    let score = 0
    if (basicInfoDone) score += 20
    if (serviceAreaDone) score += 20
    if (bioDone) score += 20
    if (preferredContactDone) score += 15
    if (avatarDone) score += 15
    if (portfolioDone) score += 10
    return score
  }
  const completionScore = calculateCompletionScore()

  // Theme helper
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load portfolio and leads interactions from localStorage on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("fundi_portfolio_items")
      if (stored) {
        setPortfolioItems(JSON.parse(stored))
      } else {
        setPortfolioItems(INITIAL_PORTFOLIO_ITEMS)
      }

      const appIds = localStorage.getItem("applied_leads")
      const arcIds = localStorage.getItem("archived_leads")
      if (appIds) setAppliedLeadIds(JSON.parse(appIds))
      if (arcIds) setArchivedLeadIds(JSON.parse(arcIds))
    }
  }, [])

  // Fetch logged in profile details
  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (!response.ok) {
        window.location.href = "/auth/login"
        return
      }
      const data = await response.json()
      if (data.user && data.user.role === "fundi") {
        setUser(data.user)
        setProfile(data.user.fundiProfile)
        setEditName(data.user.name || "")
        setEditTitle(data.user.fundiProfile?.title || "")
        setEditTrade(data.user.fundiProfile?.trade || "")
        setEditYearsExp(data.user.fundiProfile?.yearsExperience || "")
        setEditArea(data.user.fundiProfile?.serviceArea || "")
        setEditDesc(data.user.fundiProfile?.description || "")
        setPreferredContact(
          data.user.fundiProfile?.preferredContact || "whatsapp"
        )
        if (data.user.fundiProfile?.image) {
          setAvatarUrl(data.user.fundiProfile.image)
        }
        if (data.user.fundiProfile?.skills) {
          setSkills(
            data.user.fundiProfile.skills
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          )
        }
        fetchLeads()
      } else {
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Error fetching fundi profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/fundi/leads")
      if (res.ok) {
        const data = await res.json()
        // Filter out permanently deleted leads
        if (typeof window !== "undefined") {
          const storedDeleted = localStorage.getItem("deleted_leads")
          const deletedList = storedDeleted ? JSON.parse(storedDeleted) : []
          setLeads(data.filter((l: any) => !deletedList.includes(l.id)))
        } else {
          setLeads(data)
        }
      }
    } catch (error) {
      console.error("Failed to fetch matching leads:", error)
    }
  }

  const handleApplyLead = (leadId: string) => {
    const newApplied = [...appliedLeadIds, leadId]
    setAppliedLeadIds(newApplied)
    localStorage.setItem("applied_leads", JSON.stringify(newApplied))

    // Ensure it's removed from archived if it was there
    const newArchived = archivedLeadIds.filter((id) => id !== leadId)
    setArchivedLeadIds(newArchived)
    localStorage.setItem("archived_leads", JSON.stringify(newArchived))
  }

  const handleArchiveLead = (leadId: string) => {
    const newArchived = [...archivedLeadIds, leadId]
    setArchivedLeadIds(newArchived)
    localStorage.setItem("archived_leads", JSON.stringify(newArchived))

    // Ensure it's removed from applied if it was there
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
    const storedDeleted = localStorage.getItem("deleted_leads")
    const deletedList = storedDeleted ? JSON.parse(storedDeleted) : []
    const newDeleted = [...deletedList, leadId]
    localStorage.setItem("deleted_leads", JSON.stringify(newDeleted))

    setLeads((prev) => prev.filter((l) => l.id !== leadId))
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // Toggle Emergency / On Call state
  const handleToggleEmergency = async (currentVal: boolean) => {
    if (!profile) return
    try {
      // Optimistic update
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

  // Handle Profile Update Submission
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
          preferredContact: preferredContact,
        }),
      })

      if (response.ok) {
        setUpdateSuccess("Profile details saved successfully!")
        fetchProfile()
        setTimeout(() => setUpdateSuccess(""), 4000)
        // Transition to next wizard step on success
        if (wizardStep === 1) {
          setWizardStep(2)
        }
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

  // Specialty skills tag deletion helper
  const handleRemoveSkill = (tag: string) => {
    setSkills((prev) => prev.filter((s) => s !== tag))
  }

  // Avatar upload simulation helper
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIsAvatarUploading(true)
      setAvatarProgress(0)

      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64String = event.target?.result as string
        setAvatarProgress(20)

        try {
          // Upload to ImageKit via our upload API
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image: base64String,
              fileName: file.name,
              folder: "fundi_hub/profile_images",
            }),
          })

          if (!uploadRes.ok) {
            const err = await uploadRes.json()
            console.error("Image upload failed:", err)
            setIsAvatarUploading(false)
            return
          }

          const uploadData = await uploadRes.json()
          const imageUrl = uploadData.url || uploadData.data?.url
          if (!imageUrl) {
            console.error("Upload succeeded but no URL returned", uploadData)
            setIsAvatarUploading(false)
            return
          }

          setAvatarProgress(70)

          // Save image URL to fundi profile
          const res = await fetch("/api/fundi/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageUrl }),
          })

          if (res.ok) {
            setAvatarUrl(imageUrl)
            setAvatarProgress(100)
            fetchProfile()
          } else {
            const err = await res.json()
            console.error("Failed to save avatar URL to profile:", err)
          }
        } catch (error) {
          console.error("Avatar upload failed:", error)
        } finally {
          setIsAvatarUploading(false)
        }
      }
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          setAvatarProgress(percent)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Portfolio simulated upload
  const handlePortfolioUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPortfolioTitle.trim()) return

    setIsPortfolioUploading(true)
    setPortfolioProgress(0)
    setUploadFileName(
      portfolioFile
        ? portfolioFile.name
        : `${newPortfolioTitle.toLowerCase().replace(/\s+/g, "_")}.jpg`
    )
    setUploadFileSize(
      portfolioFile
        ? `${(portfolioFile.size / 1024 / 1024).toFixed(2)} MB`
        : "1.8 MB"
    )

    const finalizeUpload = (imgDataUrl: string) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setPortfolioProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)

          const newItem = {
            id: `port-${Date.now()}`,
            title: newPortfolioTitle,
            category: newPortfolioCategory,
            image: imgDataUrl,
          }

          const updatedItems = [newItem, ...portfolioItems]
          setPortfolioItems(updatedItems)
          localStorage.setItem(
            "fundi_portfolio_items",
            JSON.stringify(updatedItems)
          )

          setNewPortfolioTitle("")
          setPortfolioFile(null)
          setIsPortfolioUploading(false)
          setIsAddPortfolioOpen(false)
        }
      }, 50)
    }

    if (portfolioFile) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64String = event.target?.result as string
        finalizeUpload(base64String)
      }
      reader.readAsDataURL(portfolioFile)
    } else {
      // Fallback to static unsplash image if no file was selected
      const galleryImages = [
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=600&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&auto=format&fit=crop&q=60",
      ]
      const randomImg =
        galleryImages[portfolioItems.length % galleryImages.length]
      finalizeUpload(randomImg)
    }
  }

  // Handle Badge Activation Payment Flow
  const handleActivateBadge = async () => {
    setIsProcessingPayment(true)
    try {
      const newBadgeLevel = premiumModalType === "verified" ? "verified" : "top"
      const response = await fetch("/api/fundi/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ premiumLevel: newBadgeLevel }),
      })

      if (response.ok) {
        setIsPremiumModalOpen(false)
        fetchProfile()
        alert(
          `Success! Your ${premiumModalType === "verified" ? "Verified trust badge" : "Top & Verified status"} has been successfully activated.`
        )
      } else {
        alert("Failed to upgrade subscription tier.")
      }
    } catch (error) {
      console.error("Error upgrading premium tier:", error)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // Copy referral link
  const copyReferralLink = () => {
    if (!user) return
    const link = `${window.location.origin}/auth/signup?ref=${user.id}`
    navigator.clipboard.writeText(link)
    setCopiedReferral(true)
    setTimeout(() => setCopiedReferral(false), 3000)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/auth/login"
    } catch (err) {
      console.error(err)
    }
  }

  // Add portfolio photo mock
  const handleAddPortfolioItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPortfolioTitle.trim()) return

    const newItem = {
      id: `port-${Date.now()}`,
      title: newPortfolioTitle,
      category: newPortfolioCategory,
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=60",
    }
    setPortfolioItems((prev) => [newItem, ...prev])
    setNewPortfolioTitle("")
    setIsAddPortfolioOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen animate-pulse flex-col items-center justify-center gap-3.5 bg-radial from-background to-muted text-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs font-medium text-muted-foreground">
          Loading your profile...
        </p>
      </div>
    )
  }

  // Filter incoming leads based on state
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
  const jobEarnings = 12500
  const totalEarnings = referralEarnings + jobEarnings

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "leads",
      label: "Client Leads",
      icon: Wrench,
      badge: matchingLeads.length,
    },
    { id: "profile", label: "Profile & Portfolio", icon: FolderKanban },
    { id: "referrals", label: "Referrals & Rewards", icon: DollarSign },
    { id: "membership", label: "Membership Benefits", icon: ShieldCheck },
  ]

  return (
    <>
      {/* SHADCN COLLAPSIBLE SIDEBAR */}
      <Sidebar
        collapsible="icon"
        className="border-r border-border/40 bg-card/45 backdrop-blur-lg"
      >
        {/* Sidebar Header - adapts when collapsed */}
        <SidebarHeader className="flex flex-row items-center justify-between border-b border-border/25 px-6 py-4">
          {isCollapsed ? (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-500 text-xs font-black text-white shadow-xs select-none">
              FH
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-lg font-black tracking-tight text-transparent">
                FundiHub
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                Partner
              </span>
            </div>
          )}
        </SidebarHeader>

        {/* Sidebar Navigation Categories - spaced cleanly */}
        <SidebarContent className="space-y-6 px-3 py-6">
          {/* Section 1: Main Actions */}
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="px-3 text-[10px] font-medium text-muted-foreground/60">
              Core Operations
            </SidebarGroupLabel>
            <SidebarMenu className="mt-2 space-y-2">
              {menuItems.slice(0, 3).map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setActiveTab(item.id as any)}
                      tooltip={item.label}
                      className="h-10.5 w-full cursor-pointer rounded-lg px-3.5 text-sm font-medium hover:bg-sidebar-accent"
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>

          {/* Section 2: Marketing & Growth */}
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="px-3 text-[10px] font-medium text-muted-foreground/60">
              Grow & Benefits
            </SidebarGroupLabel>
            <SidebarMenu className="mt-2 space-y-2">
              {menuItems.slice(3).map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setActiveTab(item.id as any)}
                      tooltip={item.label}
                      className="h-10.5 w-full cursor-pointer rounded-lg px-3.5 text-sm font-medium hover:bg-sidebar-accent"
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer - adapts layout when collapsed */}
        <SidebarFooter className="space-y-4 border-t border-border/25 bg-muted/5 p-4">
          {/* On-Call Status: collapses into pure switch icon with tooltip */}
          {isCollapsed ? (
            <div className="flex justify-center py-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center">
                    <Switch
                      id="emergency-toggle-collapsed"
                      checked={profile?.isEmergency || false}
                      onCheckedChange={() =>
                        handleToggleEmergency(profile?.isEmergency)
                      }
                      className="scale-85 cursor-pointer"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  On-Call Status: {profile?.isEmergency ? "Online" : "Offline"}
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3.5 shadow-2xs">
              <div className="space-y-0.5">
                <Label
                  htmlFor="emergency-toggle"
                  className="cursor-pointer text-xs font-medium text-foreground"
                >
                  On-Call Status
                </Label>
                <p className="text-[10px] font-normal text-muted-foreground">
                  {profile?.isEmergency ? "Online" : "Offline"}
                </p>
              </div>
              <Switch
                id="emergency-toggle"
                checked={profile?.isEmergency || false}
                onCheckedChange={() =>
                  handleToggleEmergency(profile?.isEmergency)
                }
                className="cursor-pointer"
              />
            </div>
          )}

          <div
            className={cn(
              "flex border-t border-border/30 pt-3",
              isCollapsed
                ? "flex-col items-center gap-2.5"
                : "items-center justify-between"
            )}
          >
            {mounted && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 cursor-pointer rounded-lg"
                    onClick={() =>
                      setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                  >
                    {resolvedTheme === "dark" ? (
                      <Sun className="h-4.5 w-4.5 text-amber-500" />
                    ) : (
                      <Moon className="h-4.5 w-4.5 text-zinc-700" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={isCollapsed ? "icon" : "sm"}
                  onClick={handleLogout}
                  className={cn(
                    "h-9 cursor-pointer rounded-lg text-muted-foreground hover:text-destructive",
                    isCollapsed ? "w-9" : "gap-1.5 px-3 text-xs font-medium"
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  {!isCollapsed && <span>Sign Out</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="font-medium">
                  Sign Out
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* MAIN CONTAINER WORKSPACE */}
      <SidebarInset className="flex min-h-screen flex-1 flex-col">
        {/* NORMAL NAVBAR - NO CLUTTER */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-card/85 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <h2 className="text-sm font-medium text-muted-foreground capitalize">
              {activeTab}
            </h2>
          </div>

          {/* User Details initials indicator */}
          <div className="flex items-center gap-2.5 rounded-xl border border-border/10 bg-muted/40 p-1.5 pr-2.5 pl-2.5">
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-500 text-xs font-black text-white shadow-xs">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="hidden text-xs font-bold text-foreground sm:inline">
              {user?.name}
            </span>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="mx-auto w-full max-w-7xl flex-grow px-6 py-8">
          {/* OVERVIEW TAB CONTENT */}
          {activeTab === "overview" && (
            <div className="animate-in space-y-8 duration-300 fade-in slide-in-from-bottom-2">
              {/* Header Greeting Row */}
              <div className="flex flex-col gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground">
                    Habari, {user?.name || "Partner"}! 👋
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Welcome to your Partner Suite. You have{" "}
                    <span className="font-bold text-primary">
                      {matchingLeads.length} matching job opportunities
                    </span>{" "}
                    in {profile?.trade || "your trade"} today.
                  </p>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
                {/* Metric: Rating */}
                <Card className="border border-border/60 bg-card transition-all hover:border-primary/20 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-xs font-black tracking-wider text-muted-foreground uppercase">
                      <Star className="h-4 w-4 fill-primary/10 text-primary" />
                      Satisfaction Rating
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-foreground">
                        {profile?.rating.toFixed(1) || "5.0"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        / 5.0
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="text-amber-500">★</span>
                      <span>({profile?.reviews || 0} client reviews)</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Metric: Verification Tier */}
                <Card className="border border-border/60 bg-card transition-all hover:border-primary/20 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-xs font-black tracking-wider text-muted-foreground uppercase">
                      <Shield className="h-4 w-4 text-primary" />
                      Verification Badge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-1 truncate text-sm font-bold text-foreground capitalize">
                      {profile?.premiumLevel === "none"
                        ? "Standard Plan"
                        : profile?.premiumLevel + " Partner"}
                    </div>

                    <div className="mt-2 flex gap-1.5">
                      <span
                        className={`cursor-pointer rounded-md border px-2 py-0.5 text-[10px] font-black uppercase ${
                          profile?.premiumLevel === "verified" ||
                          profile?.premiumLevel === "top"
                            ? "border-blue-500/20 bg-blue-500/10 text-blue-500"
                            : "border-transparent bg-muted text-muted-foreground hover:bg-muted/70"
                        }`}
                        onClick={() =>
                          profile?.premiumLevel === "none" &&
                          (setPremiumModalType("verified"),
                          setIsPremiumModalOpen(true))
                        }
                      >
                        Verified
                      </span>
                      <span
                        className={`cursor-pointer rounded-md border px-2 py-0.5 text-[10px] font-black uppercase ${
                          profile?.premiumLevel === "top"
                            ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
                            : "border-transparent bg-muted text-muted-foreground hover:bg-muted/70"
                        }`}
                        onClick={() =>
                          profile?.premiumLevel !== "top" &&
                          (setPremiumModalType("top"),
                          setIsPremiumModalOpen(true))
                        }
                      >
                        Top Rank
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Metric: Completed Jobs */}
                <Card className="border border-border/60 bg-card transition-all hover:border-primary/20 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-xs font-black tracking-wider text-muted-foreground uppercase">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Jobs Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">
                        24
                      </span>
                      <span className="text-xs font-bold text-emerald-500">
                        +3 completed
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      98% success rating
                    </p>
                  </CardContent>
                </Card>

                {/* Metric: Total Earnings */}
                <Card className="border border-border/60 bg-card transition-all hover:border-primary/20 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-xs font-black tracking-wider text-muted-foreground uppercase">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Payout Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-1 text-2xl font-bold text-foreground">
                      KES {totalEarnings.toLocaleString()}
                    </div>
                    <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                      <span>Referrals: KES {referralEarnings}</span>
                      <span>Jobs: KES {jobEarnings}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Grid layout splits */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Left: Client matches feed */}
                <div className="space-y-4 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-1.5 text-sm font-black tracking-tight text-foreground uppercase">
                      <Wrench className="h-4 w-4 text-primary" />
                      Matching Client Leads ({matchingLeads.length})
                    </h2>
                    <button
                      onClick={() => setActiveTab("leads")}
                      className="flex cursor-pointer items-center gap-0.5 text-xs font-bold text-primary hover:underline"
                    >
                      View All Leads <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>

                  {matchingLeads.length > 0 ? (
                    <div className="space-y-4">
                      {matchingLeads.slice(0, 2).map((lead) => (
                        <Card
                          key={lead.id}
                          className="group overflow-hidden border-border bg-card shadow-2xs transition-all duration-300 hover:border-primary/45"
                        >
                          <CardHeader className="border-b border-border/30 bg-muted/15 px-5 py-4 pb-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded bg-primary/10 px-2.5 py-0.5 text-xs font-black text-primary uppercase">
                                    {lead.trade}
                                  </span>
                                  <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />{" "}
                                    {lead.createdAt}
                                  </span>
                                </div>
                                <CardTitle className="mt-2 text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                                  {lead.title}
                                </CardTitle>
                              </div>
                              <span className="flex-shrink-0 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-sm font-black text-emerald-500">
                                {lead.budget}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4 p-5">
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {lead.description}
                            </p>

                            <div className="grid grid-cols-2 gap-3 border-t border-border/20 pt-3 text-xs">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                                <span className="truncate">
                                  {lead.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
                                <span className="truncate">{lead.urgency}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-1">
                              <div className="text-xs text-muted-foreground">
                                Client:{" "}
                                <span className="font-bold text-foreground">
                                  {lead.clientName}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  asChild
                                  className="h-8 cursor-pointer rounded-lg px-3 text-xs font-bold"
                                >
                                  <a
                                    href={`tel:${lead.phone}`}
                                    className="flex items-center gap-1.5"
                                  >
                                    <Phone className="h-3.5 w-3.5" /> Call
                                  </a>
                                </Button>
                                <Button
                                  size="sm"
                                  asChild
                                  className="h-8 cursor-pointer rounded-lg px-3 text-xs font-bold"
                                >
                                  <a
                                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${lead.clientName},%2520I%2520saw%2520your%2520lead%2520on%2520FundiHub%252520for%252520'${encodeURIComponent(lead.title)}'%20and%252520I%252520am%252520available.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5"
                                  >
                                    <MessageSquare className="h-3.5 w-3.5" />{" "}
                                    WhatsApp
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-border bg-card/30 p-8 text-center shadow-xs">
                      <AlertCircle className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                      <h3 className="text-sm font-bold text-foreground">
                        No matches at the moment
                      </h3>
                      <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
                        We match incoming projects based on your trade (
                        {profile?.trade || "General"}). Once a client submits a
                        matching request, it will appear here.
                      </p>
                    </Card>
                  )}
                </div>

                {/* Right widgets column */}
                <div className="space-y-5">
                  {/* Profile Completeness: Circular gauge */}
                  <Card className="border border-border/60 bg-card">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-xs font-black tracking-wider text-foreground uppercase">
                        Profile Completeness
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4 p-5 text-center">
                      <div className="relative flex items-center justify-center">
                        <svg className="h-20 w-20 -rotate-90 transform">
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="currentColor"
                            strokeWidth="5.5"
                            className="text-muted/65"
                            fill="transparent"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="currentColor"
                            strokeWidth="5.5"
                            className="text-primary"
                            fill="transparent"
                            strokeDasharray={213.62}
                            strokeDashoffset={
                              213.62 * (1 - completionScore / 100)
                            }
                          />
                        </svg>
                        <span className="absolute text-base font-black text-foreground">
                          {completionScore}%
                        </span>
                      </div>

                      <p className="text-xs leading-normal text-muted-foreground">
                        Upload portfolio photos of previous jobs to reach 100%
                        and unlock high-paying client leads.
                      </p>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("profile")}
                        className="h-8 w-full cursor-pointer rounded-xl text-xs font-bold"
                      >
                        Manage Portfolio
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Refer & Earn link code */}
                  <Card className="border border-border/60 bg-card">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-xs font-black tracking-wider text-foreground uppercase">
                        Refer & Earn Link
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 p-5 pt-3">
                      <p className="text-xs leading-normal text-muted-foreground">
                        Earn KES 100 instantly for every partner who signs up
                        using your unique link.
                      </p>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          readOnly
                          value={
                            user
                              ? `${window.location.origin}/auth/signup?ref=${user.id}`
                              : ""
                          }
                          className="min-w-0 flex-1 rounded-lg border border-border/40 bg-muted/60 p-2.5 font-mono text-xs text-muted-foreground outline-hidden select-all"
                        />
                        <Button
                          size="sm"
                          onClick={copyReferralLink}
                          className="h-8.5 flex-shrink-0 cursor-pointer rounded-lg px-3 text-xs font-bold"
                        >
                          {copiedReferral ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Toolkit downloads */}
                  <Card className="border border-border/60 bg-card">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-xs font-black tracking-wider text-foreground uppercase">
                        Professional Toolkits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 pt-1">
                      <div className="divide-y divide-border/25 text-xs">
                        <a
                          href="#"
                          className="flex items-center justify-between p-3.5 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                        >
                          <span className="flex items-center gap-2.5 font-medium">
                            <Download className="h-4 w-4 text-primary" />
                            Invoice Template (PDF)
                          </span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <a
                          href="#"
                          className="flex items-center justify-between p-3.5 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                        >
                          <span className="flex items-center gap-2.5 font-medium">
                            <HelpCircle className="h-4 w-4 text-primary" />
                            Tax Compliance Guide
                          </span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <a
                          href="tel:+254799112919"
                          className="flex items-center justify-between p-3.5 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                        >
                          <span className="flex items-center gap-2.5 font-medium">
                            <Phone className="h-4 w-4 text-primary" />
                            24/7 Agent Support
                          </span>
                          <ChevronRight className="h-3 w-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* CLIENT LEADS TAB CONTENT */}
          {activeTab === "leads" &&
            (() => {
              const displayedLeads =
                leadsSubTab === "matching"
                  ? matchingLeads
                  : leadsSubTab === "applied"
                    ? appliedLeads
                    : archivedLeads

              return (
                <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
                  <div className="flex flex-col gap-2 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-xl font-extrabold text-foreground">
                        Client Lead Matches
                      </h1>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Review, apply, and contact clients looking for{" "}
                        {profile?.trade || "General"} services.
                      </p>
                    </div>
                    <div className="flex gap-1.5 self-start rounded-xl border border-border/20 bg-muted/40 p-1 sm:self-center">
                      <button
                        onClick={() => setLeadsSubTab("matching")}
                        className={cn(
                          "cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-black uppercase transition-all",
                          leadsSubTab === "matching"
                            ? "border border-border bg-card text-primary shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Matching ({matchingLeads.length})
                      </button>
                      <button
                        onClick={() => setLeadsSubTab("applied")}
                        className={cn(
                          "cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-black uppercase transition-all",
                          leadsSubTab === "applied"
                            ? "border border-border bg-card text-primary shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Applied ({appliedLeads.length})
                      </button>
                      <button
                        onClick={() => setLeadsSubTab("archived")}
                        className={cn(
                          "cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-black uppercase transition-all",
                          leadsSubTab === "archived"
                            ? "border border-border bg-card text-primary shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Archived ({archivedLeads.length})
                      </button>
                    </div>
                  </div>

                  {displayedLeads.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2">
                      {displayedLeads.map((lead) => (
                        <Card
                          key={lead.id}
                          className="flex flex-col justify-between overflow-hidden border-border bg-card shadow-2xs transition-colors hover:border-primary/45"
                        >
                          <div>
                            <CardHeader className="border-b border-border/30 bg-muted/15 px-5 py-4 pb-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-black text-primary uppercase">
                                      {lead.trade}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                                      <Clock className="h-3.5 w-3.5" />{" "}
                                      {lead.createdAt}
                                    </span>
                                  </div>
                                  <CardTitle className="mt-2 text-sm font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
                                    {lead.title}
                                  </CardTitle>
                                </div>
                                <span className="flex-shrink-0 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-black text-emerald-500">
                                  {lead.budget}
                                </span>
                              </div>
                            </CardHeader>

                            <CardContent className="space-y-4 p-5">
                              <p className="text-xs leading-normal text-muted-foreground">
                                {lead.description}
                              </p>

                              <div className="grid grid-cols-2 gap-3 border-t border-border/20 pt-3 text-xs">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                                  <span className="truncate">
                                    {lead.location}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
                                  <span className="truncate">
                                    {lead.urgency}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </div>

                          <div className="flex flex-col justify-between gap-4 border-t border-border/25 bg-muted/10 p-5 sm:flex-row sm:items-center">
                            <div className="text-xs text-muted-foreground">
                              Client:{" "}
                              <span className="font-bold text-foreground">
                                {lead.clientName}
                              </span>
                            </div>

                            <div className="flex flex-wrap justify-end gap-2">
                              {leadsSubTab === "matching" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleArchiveLead(lead.id)}
                                    className="h-8 cursor-pointer rounded-lg px-3 text-[11px] font-bold"
                                  >
                                    Archive
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApplyLead(lead.id)}
                                    className="h-8 cursor-pointer rounded-lg px-3 text-[11px] font-bold"
                                  >
                                    Apply Now
                                  </Button>
                                </>
                              )}

                              {leadsSubTab === "applied" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleArchiveLead(lead.id)}
                                    className="h-8 cursor-pointer rounded-lg px-3 text-[11px] font-bold"
                                  >
                                    Archive
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="h-8 cursor-pointer rounded-lg px-3 text-[11px] font-bold"
                                  >
                                    <a href={`tel:${lead.phone}`}>
                                      <Phone className="mr-1 h-3 w-3" /> Call
                                    </a>
                                  </Button>
                                  <Button
                                    size="sm"
                                    asChild
                                    className="h-8 cursor-pointer rounded-lg px-3 text-[11px] font-bold"
                                  >
                                    <a
                                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${lead.clientName},%20I%20saw%20your%20lead%20on%20FundiHub%20for%20'${encodeURIComponent(lead.title)}'%20and%20I%20am%20available.`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <MessageSquare className="mr-1 h-3 w-3" />{" "}
                                      WhatsApp
                                    </a>
                                  </Button>
                                </>
                              )}

                              {leadsSubTab === "archived" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteLeadPermanently(lead.id)
                                    }
                                    className="h-8 cursor-pointer rounded-lg border-destructive/20 px-3 text-[11px] font-bold text-destructive hover:bg-destructive/10"
                                  >
                                    Delete
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleRestoreLead(lead.id)}
                                    className="h-8 cursor-pointer rounded-lg px-3 text-[11px] font-bold"
                                  >
                                    Restore
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-border bg-card/30 p-12 text-center shadow-2xs">
                      <AlertCircle className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />
                      <h3 className="text-sm font-bold text-foreground">
                        No leads in{" "}
                        {leadsSubTab === "matching"
                          ? "matching"
                          : leadsSubTab === "applied"
                            ? "applied"
                            : "archived"}
                      </h3>
                      <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
                        {leadsSubTab === "matching"
                          ? `We match incoming projects based on your skill category (${profile?.trade || "General"}). Once a client submits a request, it will appear here.`
                          : leadsSubTab === "applied"
                            ? "You haven't applied to any leads yet. Go back to Matching and apply for jobs to start conversations."
                            : "No archived leads at this time."}
                      </p>
                    </Card>
                  )}
                </div>
              )
            })()}

          {/* PROFILE & PORTFOLIO TAB CONTENT */}
          {activeTab === "profile" &&
            (() => {
              if (!isEditingProfile) {
                return (
                  <div className="animate-in space-y-6 duration-300 fade-in">
                    {/* Compact Responsive Profile Header Card */}
                    <Card className="border border-border/40 bg-card p-6 shadow-xs">
                      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
                          {/* Avatar */}
                          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-gradient-to-br from-primary to-orange-500 text-2xl font-extrabold text-white shadow-sm">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              user?.name?.[0]?.toUpperCase()
                            )}
                          </div>

                          {/* Name and Tagline */}
                          <div className="space-y-2">
                            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-start">
                              <h2 className="text-xl font-extrabold text-foreground">
                                {editName || user?.name || "Fundi Partner"}
                              </h2>
                              {profile?.premiumLevel !== "none" && (
                                <ShieldCheck className="h-4.5 w-4.5 text-blue-500" />
                              )}
                            </div>
                            <p className="text-sm font-semibold text-foreground">
                              {editTitle ||
                                `${editTrade || "General"} Specialist`}
                            </p>

                            {/* Quick Action Badges */}
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
                              <span className="inline-flex items-center rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                {editTrade || "General"}
                              </span>
                              <span className="inline-flex items-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500">
                                {editYearsExp || "0"} Years Experience
                              </span>
                              <span className="flex inline-flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-500">
                                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                {profile?.rating.toFixed(1) || "5.0"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Edit Profile Button */}
                        <div className="flex w-full justify-center md:w-auto md:justify-end">
                          <Button
                            onClick={() => {
                              setWizardStep(1)
                              setIsEditingProfile(true)
                            }}
                            variant="outline"
                            className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border-border/60 px-4 text-sm font-semibold shadow-xs hover:bg-muted md:w-auto"
                          >
                            <PenLine className="h-4 w-4" /> Edit Profile
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Profile details grid */}
                    <div className="grid gap-6 md:grid-cols-3">
                      {/* Identity and Service Area */}
                      <Card className="space-y-4 border border-border/40 bg-card p-6">
                        <div className="flex items-center justify-between border-b border-border/30 pb-3">
                          <h3 className="text-sm font-bold text-foreground">
                            Identity & Scope
                          </h3>
                          <Button
                            onClick={() => {
                              setWizardStep(1)
                              setIsEditingProfile(true)
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-7 animate-none cursor-pointer text-xs font-bold text-primary hover:bg-transparent"
                          >
                            Edit
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-muted-foreground">
                              Service Coverage
                            </span>
                            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                              <MapPin className="h-4 w-4 text-primary" />
                              {editArea || "Not specified"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-muted-foreground">
                              Preferred Contact
                            </span>
                            <p className="flex items-center gap-2 text-sm font-medium text-foreground capitalize">
                              <MessageSquare className="h-4 w-4 text-primary" />
                              {preferredContact || "whatsapp"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-muted-foreground">
                              National ID Status
                            </span>
                            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                              <Shield className="h-4 w-4 text-primary" />
                              Verified (ID ending in **8)
                            </p>
                          </div>
                        </div>
                      </Card>

                      {/* About Story & Skills */}
                      <Card className="space-y-4 border border-border/40 bg-card p-6 md:col-span-2">
                        <div className="flex items-center justify-between border-b border-border/30 pb-3">
                          <h3 className="text-sm font-bold text-foreground">
                            Bio Story & Skills
                          </h3>
                          <Button
                            onClick={() => {
                              setWizardStep(2)
                              setIsEditingProfile(true)
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-7 animate-none cursor-pointer text-xs font-bold text-primary hover:bg-transparent"
                          >
                            Edit
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-muted-foreground">
                              Professional Bio
                            </span>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {editDesc ||
                                "No professional biography added yet. Update your profile step 2 to introduce yourself to clients!"}
                            </p>
                          </div>

                          <div className="space-y-2 pt-1">
                            <span className="text-sm font-semibold text-muted-foreground">
                              Specializations
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {skills.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded border border-border/30 bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                              {skills.length === 0 && (
                                <span className="text-sm text-muted-foreground">
                                  No specialties selected.
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Portfolio section */}
                    <Card className="border border-border/40 bg-card">
                      <CardHeader className="flex flex-row items-center justify-between border-b border-border/25 px-6 py-4">
                        <div>
                          <CardTitle className="text-base font-bold text-foreground">
                            Works Showcase Portfolio ({portfolioItems.length})
                          </CardTitle>
                          <CardDescription className="mt-0.5 text-sm text-muted-foreground">
                            Real photos of recent customer repairs and
                            installations you completed.
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsAddPortfolioOpen(true)}
                          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg text-xs font-semibold"
                        >
                          <Plus className="h-4 w-4" /> Add Project
                        </Button>
                      </CardHeader>
                      <CardContent className="p-6">
                        {portfolioItems.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            {portfolioItems.map((item) => (
                              <div
                                key={item.id}
                                className="group relative aspect-video overflow-hidden rounded-xl border border-border/30 bg-muted/20 shadow-xs"
                              >
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-3.5">
                                  <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                                    {item.category}
                                  </span>
                                  <h5 className="truncate text-sm font-bold text-white">
                                    {item.title}
                                  </h5>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-border/40 bg-muted/10 p-8 text-center">
                            <ImageIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              No portfolio photos uploaded.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Guided Profile builder checklist banner */}
                    <Card className="flex flex-col justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">
                            Guided Profile Builder
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Your profile completion score is {completionScore}%.
                            Complete all details to boost your matching
                            priority.
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setIsEditingProfile(true)}
                        size="sm"
                        className="h-10 cursor-pointer rounded-lg px-4 text-sm"
                      >
                        {completionScore === 100
                          ? "Review Wizard Steps"
                          : "Complete Profile Setup"}
                      </Button>
                    </Card>

                    {/* Add Portfolio Dialog */}
                    <Dialog
                      open={isAddPortfolioOpen}
                      onOpenChange={setIsAddPortfolioOpen}
                    >
                      <DialogContent className="w-full max-w-sm rounded-lg border border-border bg-card p-5 shadow-lg">
                        <DialogHeader>
                          <DialogTitle className="text-sm font-bold text-foreground">
                            Add Portfolio Work
                          </DialogTitle>
                          <DialogDescription className="text-xs text-muted-foreground">
                            Showcase pictures of jobs you did recently to
                            attract clients.
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          onSubmit={handlePortfolioUpload}
                          className="mt-2 space-y-4"
                        >
                          <div className="space-y-1">
                            <Label
                              htmlFor="port-title"
                              className="text-xs font-semibold text-foreground"
                            >
                              Project Title
                            </Label>
                            <Input
                              id="port-title"
                              value={newPortfolioTitle}
                              onChange={(e) =>
                                setNewPortfolioTitle(e.target.value)
                              }
                              placeholder="e.g. Master kitchen plumbing"
                              required
                              className="h-9 rounded-lg text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label
                              htmlFor="port-cat"
                              className="text-xs font-semibold text-foreground"
                            >
                              Work Category
                            </Label>
                            <select
                              id="port-cat"
                              value={newPortfolioCategory}
                              onChange={(e) =>
                                setNewPortfolioCategory(e.target.value)
                              }
                              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-xs focus-visible:outline-hidden dark:bg-card"
                            >
                              <option value="Wiring">Electrical Wiring</option>
                              <option value="Installation">
                                Equipment Installation
                              </option>
                              <option value="Repair">Trouble Repair</option>
                              <option value="Piping">Plumbing Piping</option>
                              <option value="General">Other Works</option>
                            </select>
                          </div>

                          <div className="relative rounded-lg border border-dashed border-border/40 bg-muted/15 p-5 text-center">
                            <input
                              type="file"
                              id="portfolio-upload-file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setPortfolioFile(e.target.files[0])
                                }
                              }}
                            />
                            <label
                              htmlFor="portfolio-upload-file"
                              className="block cursor-pointer"
                            >
                              <ImageIcon className="mx-auto mb-1.5 h-6 w-6 text-primary" />
                              <p className="text-[10px] font-bold text-foreground">
                                {portfolioFile
                                  ? portfolioFile.name
                                  : "Select photo of your work"}
                              </p>
                              <p className="mt-0.5 text-[8px] text-muted-foreground">
                                {portfolioFile
                                  ? `${(portfolioFile.size / 1024 / 1024).toFixed(2)} MB`
                                  : "PNG, JPG up to 5MB"}
                              </p>
                            </label>
                          </div>

                          <DialogFooter className="flex items-center justify-end gap-2 border-t border-border/30 pt-2">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setIsAddPortfolioOpen(false)}
                              className="h-9 cursor-pointer rounded-lg px-4 text-xs"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="h-9 cursor-pointer rounded-lg px-4 text-xs font-medium"
                            >
                              Save Work
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                )
              }

              return (
                <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <div>
                      <h1 className="text-xl font-extrabold text-foreground">
                        Profile Builder Wizard
                      </h1>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Configure your public identity cards and showcase photos
                        of completed jobs to potential clients.
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsEditingProfile(false)}
                      variant="outline"
                      size="sm"
                      className="h-10 cursor-pointer rounded-lg px-4 text-sm"
                    >
                      View Profile Card
                    </Button>
                  </div>

                  {/* Dynamic Stepper Header */}
                  <div className="flex flex-col justify-between gap-4 rounded-xl border border-border/40 bg-muted/10 p-4 sm:flex-row sm:items-center">
                    <div className="flex flex-wrap items-center gap-4">
                      <div
                        className="flex cursor-pointer items-center gap-2"
                        onClick={() => setWizardStep(1)}
                      >
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                            wizardStep === 1
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-card text-muted-foreground"
                          )}
                        >
                          1
                        </span>
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            wizardStep === 1
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          Identity & Contact
                        </span>
                      </div>
                      <div className="hidden h-px w-6 bg-border sm:block" />
                      <div
                        className="flex cursor-pointer items-center gap-2"
                        onClick={() => setWizardStep(2)}
                      >
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                            wizardStep === 2
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-card text-muted-foreground"
                          )}
                        >
                          2
                        </span>
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            wizardStep === 2
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          Bio & Skills
                        </span>
                      </div>
                      <div className="hidden h-px w-6 bg-border sm:block" />
                      <div
                        className="flex cursor-pointer items-center gap-2"
                        onClick={() => setWizardStep(3)}
                      >
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                            wizardStep === 3
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-card text-muted-foreground"
                          )}
                        >
                          3
                        </span>
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            wizardStep === 3
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          Media & Showcase
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1">
                      <span className="text-sm font-semibold text-primary">
                        Completion:
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {completionScore}%
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-5">
                    {/* Form column (Identity, Bio & Skills, or Media & Gallery) */}
                    <div className="space-y-5 lg:col-span-3">
                      <Card className="border border-border/40 bg-card">
                        <CardHeader className="py-4">
                          <CardTitle className="text-base font-bold text-foreground">
                            {wizardStep === 1 &&
                              "Step 1: Professional Information"}
                            {wizardStep === 2 && "Step 2: About & Skills Tags"}
                            {wizardStep === 3 &&
                              "Step 3: Photos & Gallery Showcase"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {/* Step 1: Basic professional information */}
                          {wizardStep === 1 && (
                            <form
                              onSubmit={handleUpdateProfile}
                              className="space-y-4"
                            >
                              {updateSuccess && (
                                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-sm text-emerald-500">
                                  <Check className="h-4 w-4" />{" "}
                                  <span>{updateSuccess}</span>
                                </div>
                              )}

                              <div className="space-y-1.5">
                                <Label
                                  htmlFor="edit-name"
                                  className="text-sm font-semibold text-foreground"
                                >
                                  Full Name
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  placeholder="e.g. John Doe"
                                  className="h-10 w-full rounded-lg text-sm"
                                  required
                                />
                              </div>

                              <div className="space-y-1.5">
                                <Label
                                  htmlFor="edit-title"
                                  className="text-sm font-semibold text-foreground"
                                >
                                  Professional Tagline / Title
                                </Label>
                                <Input
                                  id="edit-title"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  placeholder="e.g. Master Plumber & Piping Expert"
                                  className="h-10 w-full rounded-lg text-sm"
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <Label
                                    htmlFor="edit-trade"
                                    className="text-sm font-semibold text-foreground"
                                  >
                                    Primary Trade
                                  </Label>
                                  <Input
                                    id="edit-trade"
                                    value={editTrade}
                                    disabled
                                    className="h-10 w-full cursor-not-allowed rounded-lg bg-muted text-sm text-muted-foreground"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label
                                    htmlFor="edit-exp"
                                    className="text-sm font-semibold text-foreground"
                                  >
                                    Experience (Years)
                                  </Label>
                                  <Input
                                    id="edit-exp"
                                    value={editYearsExp}
                                    onChange={(e) =>
                                      setEditYearsExp(e.target.value)
                                    }
                                    placeholder="e.g. 5 Years"
                                    className="h-10 w-full rounded-lg text-sm"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <Label
                                    htmlFor="edit-area"
                                    className="text-sm font-semibold text-foreground"
                                  >
                                    Service Area Coverage
                                  </Label>
                                  <Input
                                    id="edit-area"
                                    value={editArea}
                                    onChange={(e) =>
                                      setEditArea(e.target.value)
                                    }
                                    placeholder="e.g. Nairobi, Kilimani & Westlands"
                                    className="h-10 w-full rounded-lg text-sm"
                                    required
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label
                                    htmlFor="preferred-contact"
                                    className="text-sm font-semibold text-foreground"
                                  >
                                    Contact Preference
                                  </Label>
                                  <select
                                    id="preferred-contact"
                                    value={preferredContact}
                                    onChange={(e) =>
                                      setPreferredContact(e.target.value)
                                    }
                                    className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-hidden dark:bg-card"
                                  >
                                    <option value="whatsapp">
                                      WhatsApp Texting
                                    </option>
                                    <option value="phone">
                                      Direct Phone Call
                                    </option>
                                    <option value="email">Email Inquiry</option>
                                  </select>
                                </div>
                              </div>

                              <Button
                                type="submit"
                                disabled={isUpdating}
                                className="mt-1 h-10 w-full cursor-pointer rounded-lg text-sm font-semibold"
                              >
                                {isUpdating ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                    Saving Details...
                                  </>
                                ) : (
                                  "Save & Continue"
                                )}
                              </Button>
                            </form>
                          )}

                          {/* Step 2: About bio description and skills tag manager */}
                          {wizardStep === 2 && (
                            <div className="space-y-5">
                              <div className="space-y-1.5">
                                <Label
                                  htmlFor="edit-desc"
                                  className="text-sm font-semibold text-foreground"
                                >
                                  Professional Description / Bio
                                </Label>
                                <textarea
                                  id="edit-desc"
                                  value={editDesc}
                                  onChange={(e) => setEditDesc(e.target.value)}
                                  placeholder="Describe your expertise, typical jobs you take..."
                                  className="flex min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/10"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground">
                                  Skills / Specialty Badges
                                </Label>
                                <div className="flex min-h-12 flex-wrap gap-2 rounded-lg border border-border/40 bg-muted/10 p-3">
                                  {skills.map((tag) => (
                                    <span
                                      key={tag}
                                      className="inline-flex items-center gap-1.5 rounded border border-border/30 bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                                    >
                                      {tag}
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(tag)}
                                        className="cursor-pointer text-muted-foreground hover:text-destructive"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </span>
                                  ))}
                                  {skills.length === 0 && (
                                    <span className="text-sm text-muted-foreground">
                                      No specialty badges added yet.
                                    </span>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  <Input
                                    value={newSkillInput}
                                    onChange={(e) =>
                                      setNewSkillInput(e.target.value)
                                    }
                                    placeholder="e.g. Toilet Repair, Leak Tracing"
                                    className="h-10 text-sm"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault()
                                        if (
                                          newSkillInput.trim() &&
                                          !skills.includes(newSkillInput.trim())
                                        ) {
                                          setSkills((prev) => [
                                            ...prev,
                                            newSkillInput.trim(),
                                          ])
                                          setNewSkillInput("")
                                        }
                                      }
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      if (
                                        newSkillInput.trim() &&
                                        !skills.includes(newSkillInput.trim())
                                      ) {
                                        setSkills((prev) => [
                                          ...prev,
                                          newSkillInput.trim(),
                                        ])
                                        setNewSkillInput("")
                                      }
                                    }}
                                    size="sm"
                                    className="h-10 rounded-lg px-4 text-sm font-semibold"
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-4 border-t border-border/30 pt-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setWizardStep(1)}
                                  className="h-10 rounded-lg px-4 text-sm"
                                >
                                  Back
                                </Button>
                                <Button
                                  type="button"
                                  onClick={async () => {
                                    setIsUpdating(true)
                                    try {
                                      await fetch("/api/fundi/profile", {
                                        method: "PUT",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          description: editDesc,
                                          skills: skills.join(", "),
                                        }),
                                      })
                                      setWizardStep(3)
                                      fetchProfile()
                                    } catch (e) {
                                      console.error(e)
                                    } finally {
                                      setIsUpdating(false)
                                    }
                                  }}
                                  className="h-10 rounded-lg px-6 text-sm"
                                >
                                  Continue to Showcase
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Step 3: Media upload controls */}
                          {wizardStep === 3 && (
                            <div className="space-y-5">
                              {/* 1. Avatar upload with progress bar */}
                              <div className="space-y-4 rounded-lg border border-border bg-muted/10 p-5">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-bold text-foreground">
                                    1. Face Avatar Photo
                                  </h4>
                                  {avatarDone && (
                                    <span className="text-xs font-semibold text-emerald-500">
                                      Completed
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/40 bg-muted">
                                    {avatarUrl ? (
                                      <img
                                        src={avatarUrl}
                                        alt="Avatar Preview"
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-xl font-black text-muted-foreground">
                                        {user?.name?.[0]?.toUpperCase()}
                                      </span>
                                    )}
                                    {isAvatarUploading && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-bold text-white">
                                        {avatarProgress}%
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <p className="text-sm leading-normal text-muted-foreground">
                                      Configure a high quality face picture for
                                      your public search listings.
                                    </p>
                                    <div className="relative">
                                      <input
                                        type="file"
                                        id="avatar-upload-file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                        disabled={isAvatarUploading}
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-10 cursor-pointer text-sm font-semibold"
                                        asChild
                                      >
                                        <label
                                          htmlFor="avatar-upload-file"
                                          className="flex cursor-pointer items-center gap-1.5 px-4"
                                        >
                                          <Camera className="h-4 w-4" />
                                          {isAvatarUploading
                                            ? "Uploading..."
                                            : "Upload Avatar"}
                                        </label>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                {isAvatarUploading && (
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                                      <span>Transferring picture...</span>
                                      <span>{avatarProgress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                      <div
                                        className="h-full rounded-full bg-primary transition-all duration-150"
                                        style={{ width: `${avatarProgress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* 2. Portfolio manager */}
                              <div className="space-y-4 rounded-lg border border-border bg-muted/10 p-5">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-bold text-foreground">
                                    2. Project Showcase Photos
                                  </h4>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setIsAddPortfolioOpen(true)}
                                    className="h-9 cursor-pointer rounded-lg text-xs font-semibold"
                                  >
                                    + Add Project
                                  </Button>
                                </div>

                                {isPortfolioUploading && (
                                  <div className="space-y-2.5 rounded-lg border border-border/40 bg-card p-4">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-center gap-2">
                                        <FileCheck className="h-5 w-5 flex-shrink-0 animate-bounce text-primary" />
                                        <div className="min-w-0">
                                          <p className="truncate text-sm font-semibold text-foreground">
                                            {uploadFileName}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {uploadFileSize}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="text-sm font-bold text-primary">
                                        {portfolioProgress}%
                                      </span>
                                    </div>
                                    <div className="space-y-1.5">
                                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                          className="h-full rounded-full bg-primary transition-all duration-75"
                                          style={{
                                            width: `${portfolioProgress}%`,
                                          }}
                                        />
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        Uploading project work mockup photo...
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {portfolioItems.length > 0 ? (
                                  <div className="grid grid-cols-2 gap-3 pt-1">
                                    {portfolioItems.map((item) => (
                                      <div
                                        key={item.id}
                                        className="group relative aspect-video overflow-hidden rounded-lg border border-border/30 bg-muted/20"
                                      >
                                        <img
                                          src={item.image}
                                          alt={item.title}
                                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-3">
                                          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                                            {item.category}
                                          </span>
                                          <h5 className="truncate text-sm font-bold text-white">
                                            {item.title}
                                          </h5>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="rounded-lg border border-dashed border-border/40 bg-card p-6 text-center">
                                    <ImageIcon className="mx-auto mb-1.5 h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                      No portfolio photos uploaded.
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between gap-4 border-t border-border/30 pt-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setWizardStep(2)}
                                  className="h-10 rounded-lg px-4 text-sm"
                                >
                                  Back
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => {
                                    setUpdateSuccess(
                                      "All wizard profile configurations saved successfully!"
                                    )
                                    setTimeout(() => setUpdateSuccess(""), 4000)
                                    setIsEditingProfile(false)
                                  }}
                                  className="h-10 rounded-lg px-6 text-sm"
                                >
                                  Finish Profile
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Preview and Gallery column */}
                    <div className="space-y-5 lg:col-span-2">
                      {/* Completion Checklist */}
                      <Card className="border border-border/60 bg-card">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-bold text-foreground">
                            Profile Task Checklist
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 p-5 pt-1">
                          <div className="mb-2 flex items-center justify-between border-b border-border/25 pb-2 text-sm">
                            <span className="text-muted-foreground">
                              Completeness Score:
                            </span>
                            <span className="font-bold text-primary">
                              {completionScore}%
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-sm">
                              <span
                                className={cn(
                                  "flex items-center gap-2",
                                  basicInfoDone
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                )}
                              >
                                <CheckCircle2
                                  className={cn(
                                    "h-4.5 w-4.5 transition-all duration-300",
                                    basicInfoDone
                                      ? "fill-emerald-500/10 text-emerald-500"
                                      : "text-muted-foreground/40"
                                  )}
                                />
                                Basic Identity Details
                              </span>
                              <span className="text-xs font-semibold text-muted-foreground">
                                20%
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span
                                className={cn(
                                  "flex items-center gap-2",
                                  serviceAreaDone
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                )}
                              >
                                <CheckCircle2
                                  className={cn(
                                    "h-4.5 w-4.5 transition-all duration-300",
                                    serviceAreaDone
                                      ? "fill-emerald-500/10 text-emerald-500"
                                      : "text-muted-foreground/40"
                                  )}
                                />
                                Service scope & exp
                              </span>
                              <span className="text-xs font-semibold text-muted-foreground">
                                20%
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span
                                className={cn(
                                  "flex items-center gap-2",
                                  bioDone
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                )}
                              >
                                <CheckCircle2
                                  className={cn(
                                    "h-4.5 w-4.5 transition-all duration-300",
                                    bioDone
                                      ? "fill-emerald-500/10 text-emerald-500"
                                      : "text-muted-foreground/40"
                                  )}
                                />
                                Detailed Bio Story
                              </span>
                              <span className="text-xs font-semibold text-muted-foreground">
                                20%
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span
                                className={cn(
                                  "flex items-center gap-2",
                                  preferredContactDone
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                )}
                              >
                                <CheckCircle2
                                  className={cn(
                                    "h-4.5 w-4.5 transition-all duration-300",
                                    preferredContactDone
                                      ? "fill-emerald-500/10 text-emerald-500"
                                      : "text-muted-foreground/40"
                                  )}
                                />
                                Contact Preference
                              </span>
                              <span className="text-xs font-semibold text-muted-foreground">
                                15%
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span
                                className={cn(
                                  "flex items-center gap-2",
                                  avatarDone
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                )}
                              >
                                <CheckCircle2
                                  className={cn(
                                    "h-4.5 w-4.5 transition-all duration-300",
                                    avatarDone
                                      ? "fill-emerald-500/10 text-emerald-500"
                                      : "text-muted-foreground/40"
                                  )}
                                />
                                Avatar Photo uploaded
                              </span>
                              <span className="text-xs font-semibold text-muted-foreground">
                                15%
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span
                                className={cn(
                                  "flex items-center gap-2",
                                  portfolioDone
                                    ? "animate-in text-foreground"
                                    : "text-muted-foreground"
                                )}
                              >
                                <CheckCircle2
                                  className={cn(
                                    "h-4.5 w-4.5 transition-all duration-300",
                                    portfolioDone
                                      ? "fill-emerald-500/10 text-emerald-500"
                                      : "text-muted-foreground/40"
                                  )}
                                />
                                Portfolio Showcase photo
                              </span>
                              <span className="text-xs font-semibold text-muted-foreground">
                                10%
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Public Card Preview */}
                      <Card className="relative overflow-hidden border border-border/40 bg-gradient-to-b from-card to-muted/15">
                        <CardHeader className="border-b border-border/25 py-3.5">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-bold text-foreground">
                              Public Card Preview
                            </CardTitle>
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-emerald-500">
                              Active Listing
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/40 bg-gradient-to-br from-primary to-orange-500 text-sm font-extrabold text-white">
                              {avatarUrl ? (
                                <img
                                  src={avatarUrl}
                                  alt="Avatar"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                user?.name?.[0]?.toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-sm font-bold text-foreground">
                                  {editName || user?.name}
                                </h4>
                                {profile?.premiumLevel !== "none" && (
                                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                                )}
                              </div>
                              <p className="text-sm font-semibold text-muted-foreground">
                                {editTitle || `${editTrade} Specialist`}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="inline-flex items-center rounded border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                              {editTrade}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-4.5 w-4.5 text-primary" />{" "}
                              {editArea || "Nairobi"}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />{" "}
                              {profile?.rating.toFixed(1)} (
                              {profile?.reviews || 0} reviews)
                            </span>
                          </div>

                          <p className="line-clamp-3 border-t border-border/20 pt-2.5 text-sm leading-relaxed text-muted-foreground">
                            {editDesc ||
                              "No description set yet. Write a professional description in Step 2 to describe your skills."}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Add Portfolio Dialog */}
                  <Dialog
                    open={isAddPortfolioOpen}
                    onOpenChange={setIsAddPortfolioOpen}
                  >
                    <DialogContent className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg">
                      <DialogHeader>
                        <DialogTitle className="text-base font-bold text-foreground">
                          Add Portfolio Work
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                          Showcase pictures of jobs you did recently to attract
                          clients.
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={handlePortfolioUpload}
                        className="mt-2 space-y-4"
                      >
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="port-title"
                            className="text-sm font-semibold text-foreground"
                          >
                            Project Title
                          </Label>
                          <Input
                            id="port-title"
                            value={newPortfolioTitle}
                            onChange={(e) =>
                              setNewPortfolioTitle(e.target.value)
                            }
                            placeholder="e.g. Master kitchen plumbing"
                            required
                            className="h-10 rounded-lg text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="port-cat"
                            className="text-sm font-semibold text-foreground"
                          >
                            Work Category
                          </Label>
                          <select
                            id="port-cat"
                            value={newPortfolioCategory}
                            onChange={(e) =>
                              setNewPortfolioCategory(e.target.value)
                            }
                            className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-hidden dark:bg-card"
                          >
                            <option value="Wiring">Electrical Wiring</option>
                            <option value="Installation">
                              Equipment Installation
                            </option>
                            <option value="Repair">Trouble Repair</option>
                            <option value="Piping">Plumbing Piping</option>
                            <option value="General">Other Works</option>
                          </select>
                        </div>

                        <div className="rounded-lg border border-dashed border-border/40 bg-muted/15 p-5 text-center">
                          <ImageIcon className="mx-auto mb-1.5 h-7 w-7 text-primary" />
                          <p className="text-sm font-semibold text-foreground">
                            Select photos of your work
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            PNG, JPG up to 5MB (Simulated upload)
                          </p>
                        </div>

                        <DialogFooter className="flex items-center justify-end gap-2 border-t border-border/30 pt-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsAddPortfolioOpen(false)}
                            className="h-10 cursor-pointer rounded-lg px-4 text-sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="h-10 cursor-pointer rounded-lg px-4 text-sm font-semibold"
                          >
                            Save Work
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              )
            })()}

          {/* REFERRALS & REWARDS TAB CONTENT */}
          {activeTab === "referrals" && (
            <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
              <div className="border-b border-border/40 pb-4">
                <h1 className="text-xl font-extrabold text-foreground">
                  Referrals & Rewards
                </h1>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Monitor your invite lists, copy registration links, and track
                  your wallet payout statistics.
                </p>
              </div>

              {/* Stats overview cards row */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="border border-border/40 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="p-4">
                    <div className="text-xs font-black tracking-wider text-muted-foreground uppercase">
                      Total Referred
                    </div>
                    <div className="mt-1.5 text-lg font-black text-foreground">
                      {referralCount} Partners
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border/40 bg-gradient-to-br from-emerald-500/5 to-transparent">
                  <CardContent className="p-4">
                    <div className="text-xs font-black tracking-wider text-muted-foreground uppercase">
                      Pending Payout
                    </div>
                    <div className="mt-1.5 text-lg font-black text-foreground">
                      {user?.referrals?.filter(
                        (r: any) =>
                          r.status === "pending" || r.status === "registered"
                      ).length || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border/40 bg-gradient-to-br from-blue-500/5 to-transparent">
                  <CardContent className="p-4">
                    <div className="text-xs font-black tracking-wider text-muted-foreground uppercase">
                      Withdrawn Earnings
                    </div>
                    <div className="mt-1.5 text-lg font-black text-foreground">
                      KES {referralEarnings}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Refer link widgets grid */}
              <div className="grid gap-6 md:grid-cols-5">
                {/* Refer code card */}
                <div className="space-y-5 md:col-span-3">
                  <Card className="border border-border/40 bg-card">
                    <CardHeader className="py-4">
                      <CardTitle className="text-sm font-bold text-foreground">
                        Your Referral Link
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={
                            user
                              ? `${window.location.origin}/auth/signup?ref=${user.id}`
                              : ""
                          }
                          className="flex-grow rounded-lg border border-border/30 bg-muted p-3 font-mono text-xs text-muted-foreground outline-hidden select-all"
                        />
                        <Button
                          onClick={copyReferralLink}
                          className="h-10 flex-shrink-0 cursor-pointer rounded-lg px-4 text-xs font-bold"
                        >
                          {copiedReferral ? "Copied!" : "Copy"}
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="mr-1 text-xs font-bold text-muted-foreground uppercase">
                          Quick Share:
                        </span>
                        <Button
                          size="xs"
                          variant="outline"
                          className="h-7 cursor-pointer rounded-md text-xs font-bold"
                          asChild
                        >
                          <a
                            href={`https://wa.me/?text=Hello!%20Join%20FundiHub%2520as%2520a%2520skilled%2520fundi%2520using%2520my%2520link%2520and%252520start%252520getting%252520direct%252520jobs:%20${encodeURIComponent(user ? `${window.location.origin}/auth/signup?ref=${user.id}` : "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          className="h-7 cursor-pointer rounded-md text-xs font-bold"
                          asChild
                        >
                          <a
                            href={`https://twitter.com/intent/tweet?text=Register%20on%20FundiHub%20to%20get%20client%20job%20leads%20near%20you.%20Link:%20${encodeURIComponent(user ? `${window.location.origin}/auth/signup?ref=${user.id}` : "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Twitter
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Referral History database log list */}
                  <Card className="overflow-hidden border border-border/40 bg-card">
                    <CardHeader className="border-b border-border/30 py-4">
                      <CardTitle className="text-xs font-bold text-foreground">
                        Referral History Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {user?.referrals?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-left text-xs">
                            <thead>
                              <tr className="border-b border-border/35 bg-muted/20 font-bold text-muted-foreground">
                                <th className="p-3.5">Referee Name</th>
                                <th className="p-3.5">Trade</th>
                                <th className="p-3.5">Status</th>
                                <th className="p-3.5 text-right">Commission</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/25">
                              {user.referrals.map((ref: any) => (
                                <tr key={ref.id} className="hover:bg-muted/10">
                                  <td className="p-3.5 font-bold text-foreground">
                                    {ref.refereeName}
                                  </td>
                                  <td className="p-3.5 text-muted-foreground capitalize">
                                    {ref.refereeTrade}
                                  </td>
                                  <td className="p-3.5">
                                    <span
                                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase ${
                                        ref.status === "paid"
                                          ? "border border-emerald-500/15 bg-emerald-500/10 text-emerald-500"
                                          : ref.status === "registered"
                                            ? "border border-blue-500/15 bg-blue-500/10 text-blue-500"
                                            : "border border-amber-500/15 bg-amber-500/10 text-amber-500"
                                      }`}
                                    >
                                      {ref.status}
                                    </span>
                                  </td>
                                  <td className="p-3.5 text-right font-black text-foreground">
                                    KES {ref.commission}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="space-y-2 p-8 text-center text-muted-foreground">
                          <Info className="mx-auto h-6 w-6 text-muted-foreground" />
                          <p className="text-xs">
                            No referrals logged. Share your link to start
                            earning!
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Earnings Chart sidebar column */}
                <div className="space-y-5 md:col-span-2">
                  <Card className="border border-border/40 bg-card">
                    <CardHeader className="border-b border-border/30 py-4">
                      <CardTitle className="text-xs font-black tracking-wider text-foreground uppercase">
                        Weekly Payout Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-5">
                      {/* Compact pure CSS Bar Chart */}
                      <div className="flex h-28 items-end justify-between gap-3.5 pt-1">
                        <div className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                          <div className="group relative h-[10%] w-full cursor-pointer rounded-t-md bg-muted transition-colors hover:bg-primary/20">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 rounded-sm border border-border bg-popover px-1.5 py-0.5 text-[8px] text-popover-foreground opacity-0 shadow-xs transition-opacity group-hover:opacity-100">
                              KES 100
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-muted-foreground">
                            W1
                          </span>
                        </div>
                        <div className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                          <div className="group relative h-[40%] w-full cursor-pointer rounded-t-md bg-primary/40 transition-colors hover:bg-primary/60">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 rounded-sm border border-border bg-popover px-1.5 py-0.5 text-[8px] text-popover-foreground opacity-0 shadow-xs transition-opacity group-hover:opacity-100">
                              KES 400
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-muted-foreground">
                            W2
                          </span>
                        </div>
                        <div className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                          <div className="group relative h-[75%] w-full cursor-pointer rounded-t-md bg-primary/80 transition-colors hover:bg-primary">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 rounded-sm border border-border bg-popover px-1.5 py-0.5 text-[8px] text-popover-foreground opacity-0 shadow-xs transition-opacity group-hover:opacity-100">
                              KES 750
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-muted-foreground">
                            W3
                          </span>
                        </div>
                        <div className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                          <div className="group relative h-[95%] w-full cursor-pointer rounded-t-md bg-primary transition-colors hover:bg-primary">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 rounded-sm border border-border bg-popover px-1.5 py-0.5 text-[8px] text-popover-foreground opacity-0 shadow-xs transition-opacity group-hover:opacity-100">
                              KES 950
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-muted-foreground">
                            W4
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-border/25 pt-2.5 text-xs leading-normal text-muted-foreground">
                        <div className="flex items-center justify-between font-bold text-foreground">
                          <span>Promotion Payouts:</span>
                          <span className="font-black text-primary">
                            KES 100 / sign-up
                          </span>
                        </div>
                        <p>
                          Referral payouts transfer automatically to your
                          registered MPesa mobile number on Friday mornings.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* MEMBERSHIP BENEFITS TAB CONTENT */}
          {activeTab === "membership" && (
            <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
              <div className="border-b border-border/40 pb-4">
                <h1 className="text-xl font-extrabold text-foreground">
                  Membership & Boost Tiers
                </h1>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Upgrade your profile tier package to build massive customer
                  trust and listing priority.
                </p>
              </div>

              {/* Pricing Cards Layout (Max-width container, more compact height) */}
              <div className="mx-auto grid max-w-2xl gap-6 pt-3 md:grid-cols-2">
                {/* Package: Verified Trust Tick */}
                <Card
                  className={`relative overflow-hidden border transition-all duration-200 hover:shadow-md ${
                    profile?.premiumLevel === "verified"
                      ? "border-blue-500/50 bg-blue-500/5"
                      : "border-border bg-card"
                  }`}
                >
                  <CardHeader className="px-4 pt-6 pb-3 text-center">
                    <span className="mx-auto mb-3 w-max rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-blue-500 uppercase">
                      Trust Tick
                    </span>
                    <CardTitle className="text-lg font-black text-foreground">
                      Verified Badge Tick
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      Get verified instantly and earn consumer trust
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 px-4 pb-6 text-center">
                    <div className="space-y-1">
                      <span className="text-3xl font-black text-foreground">
                        KES 300
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        / month
                      </span>
                    </div>

                    <div className="mx-auto max-w-[230px] space-y-2.5 border-t border-b border-border/30 py-4 text-left text-xs text-muted-foreground">
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 flex-shrink-0 text-blue-500" />
                        <span>Displays Blue Verified checkmark icon</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 flex-shrink-0 text-blue-500" />
                        <span>30% boost in search clicks</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 flex-shrink-0 text-blue-500" />
                        <span>Premium Client Support Access</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setPremiumModalType("verified")
                        setIsPremiumModalOpen(true)
                      }}
                      disabled={
                        profile?.premiumLevel === "verified" ||
                        profile?.premiumLevel === "top"
                      }
                      className="h-10 w-full cursor-pointer rounded-lg text-xs font-bold"
                    >
                      {profile?.premiumLevel === "verified" ||
                      profile?.premiumLevel === "top"
                        ? "Tier Active"
                        : "Activate Verified Tick"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Package: Top Ranked visibility */}
                <Card
                  className={`relative overflow-hidden border transition-all duration-200 hover:shadow-md ${
                    profile?.premiumLevel === "top"
                      ? "border-amber-500/50 bg-amber-500/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="absolute top-0 right-0 rounded-bl-lg bg-amber-500 px-3 py-1 text-[8px] font-black tracking-wider text-white uppercase shadow-xs">
                    Popular
                  </div>
                  <CardHeader className="px-4 pt-6 pb-3 text-center">
                    <span className="mx-auto mb-3 w-max rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-amber-500 uppercase">
                      Elite Ranking
                    </span>
                    <CardTitle className="text-lg font-black text-foreground">
                      Top-Rank Verified Elite
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      Propel your card to top results
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 px-4 pb-6 text-center">
                    <div className="space-y-1">
                      <span className="text-3xl font-black text-foreground">
                        KES 500
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        / month
                      </span>
                    </div>

                    <div className="mx-auto max-w-[230px] space-y-2.5 border-t border-b border-border/30 py-4 text-left text-xs text-muted-foreground">
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 flex-shrink-0 text-amber-500" />
                        <span>Verified Badge tick displays</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 flex-shrink-0 text-amber-500" />
                        <span>Top row sorting priority</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 flex-shrink-0 text-amber-500" />
                        <span>Up to 5x higher client leads</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setPremiumModalType("top")
                        setIsPremiumModalOpen(true)
                      }}
                      disabled={profile?.premiumLevel === "top"}
                      className="h-10 w-full cursor-pointer rounded-lg text-xs font-bold"
                    >
                      {profile?.premiumLevel === "top"
                        ? "Tier Active"
                        : "Upgrade to Top Partner"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>

      {/* Premium Badge Checkout Dialog */}
      <Dialog open={isPremiumModalOpen} onOpenChange={setIsPremiumModalOpen}>
        <DialogContent className="w-full max-w-sm rounded-lg border border-border bg-card p-5 shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <Zap className="h-4 w-4 animate-pulse text-primary" /> Activate
              Visibility Tier
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Boost your profile discovery rating and gain customer trust.
            </DialogDescription>
          </DialogHeader>

          <div className="my-2 space-y-4 border-t border-b border-border/30 py-4">
            <div className="space-y-1.5 rounded-lg border border-border/40 bg-muted/40 p-3.5 text-center">
              <span className="text-[9px] font-black tracking-wider text-muted-foreground uppercase">
                {premiumModalType === "verified"
                  ? "Verified Trust Tick"
                  : "Top & Verified Tier"}
              </span>
              <div className="text-2xl font-black text-primary">
                {premiumModalType === "verified"
                  ? "Ksh 300 / mo"
                  : "Ksh 500 / mo"}
              </div>
              <p className="text-xs leading-normal text-muted-foreground">
                {premiumModalType === "verified"
                  ? "Displays a verified trust tick icon on your profile search card, building immediate credibility."
                  : "Propels your profile listing to the top of category searches, giving you 5x more customer leads."}
              </p>
            </div>

            <div className="space-y-2 rounded-lg border border-primary/10 bg-primary/5 p-3 text-xs leading-normal text-muted-foreground">
              <div className="flex gap-1.5">
                <Check className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                <span>Immediate badge activation on profile search</span>
              </div>
              <div className="flex gap-1.5">
                <Check className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                <span>Cancel or pause your subscription badge any time</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPremiumModalOpen(false)}
              className="h-9.5 cursor-pointer rounded-lg px-4 text-xs text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleActivateBadge}
              disabled={isProcessingPayment}
              className="h-9.5 cursor-pointer rounded-lg px-4 text-xs font-bold"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{" "}
                  Activating...
                </>
              ) : (
                "Pay & Activate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// MAIN ENTRY WRAPPER PROVIDER CONTAINER
export default function FundiDashboard() {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardInner />
    </SidebarProvider>
  )
}
