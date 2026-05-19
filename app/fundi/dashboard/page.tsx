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
  PenLine
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  DialogFooter
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
  useSidebar
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
    description: "Our kitchen sink pipe has burst and water is flooding the floor. Need a plumber right away.",
    phone: "+254 712 345 678",
    createdAt: "10 mins ago"
  },
  {
    id: "lead-2",
    clientName: "Grace M.",
    trade: "Electrician",
    title: "Short Circuit in Living Room",
    location: "Nairobi, Langata",
    budget: "KES 5,000",
    urgency: "Within 3 Days",
    description: "Several sockets have stopped working after a spark. Need an electrician to trace the fault.",
    phone: "+254 722 890 123",
    createdAt: "45 mins ago"
  },
  {
    id: "lead-3",
    clientName: "John O.",
    trade: "Painter",
    title: "Apartment Interior Painting",
    location: "Mombasa, Nyali",
    budget: "KES 25,000",
    urgency: "Flexible / Planning",
    description: "Looking to repaint the interior of a 2-bedroom apartment next week. Budget is flexible.",
    phone: "+254 733 456 789",
    createdAt: "2 hours ago"
  },
  {
    id: "lead-4",
    clientName: "Carpenter",
    trade: "Carpenter",
    title: "Fix Wardrobe Hinges",
    location: "Nairobi, Westlands",
    budget: "KES 2,000",
    urgency: "Within a Week",
    description: "Two sliding wardrobe doors have come off their hinges and need realignment.",
    phone: "+254 701 234 567",
    createdAt: "4 hours ago"
  },
  {
    id: "lead-5",
    clientName: "Peter K.",
    trade: "Plumber",
    title: "Install Instant Shower Heater",
    location: "Nairobi, Kasarani",
    budget: "KES 1,500",
    urgency: "Within 3 Days",
    description: "Looking for an experienced plumber to mount and connect a brand new instant heater in bathroom.",
    phone: "+254 711 999 888",
    createdAt: "1 day ago"
  }
]

// Mock portfolio items
const INITIAL_PORTFOLIO_ITEMS = [
  {
    id: "port-1",
    title: "House Wiring Project",
    category: "Wiring",
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "port-2",
    title: "Distribution Box Setup",
    category: "Installation",
    image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=600&auto=format&fit=crop&q=60"
  }
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
  const [premiumModalType, setPremiumModalType] = useState<"verified" | "top">("verified")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Layout states
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "profile" | "referrals" | "membership">("overview")

  // Portfolio local state
  const [portfolioItems, setPortfolioItems] = useState(INITIAL_PORTFOLIO_ITEMS)
  const [newPortfolioTitle, setNewPortfolioTitle] = useState("")
  const [newPortfolioCategory, setNewPortfolioCategory] = useState("General")
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false)

  // Profile Wizard / Completions States
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [skills, setSkills] = useState<string[]>(["Emergency Repair", "Leak Detection", "Pipe Installation"])
  const [newSkillInput, setNewSkillInput] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarProgress, setAvatarProgress] = useState(0)
  const [isAvatarUploading, setIsAvatarUploading] = useState(false)
  const [portfolioProgress, setPortfolioProgress] = useState(0)
  const [isPortfolioUploading, setIsPortfolioUploading] = useState(false)
  const [uploadFileName, setUploadFileName] = useState("")
  const [uploadFileSize, setUploadFileSize] = useState("")
  const [preferredContact, setPreferredContact] = useState("whatsapp")

  // Theme helper
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
        setPreferredContact(data.user.fundiProfile?.preferredContact || "whatsapp")
        if (data.user.fundiProfile?.image) {
          setAvatarUrl(data.user.fundiProfile.image)
        }
      } else {
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Error fetching fundi profile:", error)
    } finally {
      setIsLoading(false)
    }
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
        body: JSON.stringify({ isEmergency: !currentVal })
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
          preferredContact: preferredContact
        })
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
      setIsAvatarUploading(true)
      setAvatarProgress(0)
      
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setAvatarProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          // Set simulated user avatar URL
          const newAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
          setAvatarUrl(newAvatar)
          setIsAvatarUploading(false)
          
          // Call API to save avatar url
          fetch("/api/fundi/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: newAvatar })
          }).then(() => {
            fetchProfile()
          })
        }
      }, 150)
    }
  }

  // Portfolio simulated upload
  const handlePortfolioUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPortfolioTitle.trim()) return

    setIsPortfolioUploading(true)
    setPortfolioProgress(0)
    setUploadFileName(`${newPortfolioTitle.toLowerCase().replace(/\s+/g, "_")}.jpg`)
    setUploadFileSize("1.8 MB")

    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setPortfolioProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        
        const galleryImages = [
          "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=600&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&auto=format&fit=crop&q=60"
        ]
        const randomImg = galleryImages[portfolioItems.length % galleryImages.length]

        const newItem = {
          id: `port-${Date.now()}`,
          title: newPortfolioTitle,
          category: newPortfolioCategory,
          image: randomImg
        }

        setPortfolioItems((prev) => [newItem, ...prev])
        setNewPortfolioTitle("")
        setIsPortfolioUploading(false)
        setIsAddPortfolioOpen(false)
      }
    }, 80)
  }

  // Handle Badge Activation Payment Flow
  const handleActivateBadge = async () => {
    setIsProcessingPayment(true)
    try {
      const newBadgeLevel = premiumModalType === "verified" ? "verified" : "top"
      const response = await fetch("/api/fundi/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ premiumLevel: newBadgeLevel })
      })

      if (response.ok) {
        setIsPremiumModalOpen(false)
        fetchProfile()
        alert(`Success! Your ${premiumModalType === "verified" ? "Verified trust badge" : "Top & Verified status"} has been successfully activated.`)
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
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=60"
    }
    setPortfolioItems((prev) => [newItem, ...prev])
    setNewPortfolioTitle("")
    setIsAddPortfolioOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-radial from-background to-muted text-foreground gap-3.5 animate-pulse">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs font-medium text-muted-foreground">
          Loading your profile...
        </p>
      </div>
    )
  }

  // Filter mock incoming leads that match the active fundi's trade
  const matchingLeads = MOCK_CLIENT_LEADS.filter(
    (lead) => lead.trade.toLowerCase() === (profile?.trade || "").toLowerCase()
  )

  const referralCount = user?.referrals?.length || 0
  const referralEarnings = referralCount * 100
  const jobEarnings = 12500
  const totalEarnings = referralEarnings + jobEarnings

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "leads", label: "Client Leads", icon: Wrench, badge: matchingLeads.length },
    { id: "profile", label: "Profile & Portfolio", icon: FolderKanban },
    { id: "referrals", label: "Referrals & Rewards", icon: DollarSign },
    { id: "membership", label: "Membership Benefits", icon: ShieldCheck }
  ]

  return (
    <>
      {/* SHADCN COLLAPSIBLE SIDEBAR */}
      <Sidebar collapsible="icon" className="border-r border-border/40 bg-card/45 backdrop-blur-lg">
        
        {/* Sidebar Header - adapts when collapsed */}
        <SidebarHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border/25">
          {isCollapsed ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-500 text-white font-black text-xs mx-auto shadow-xs select-none">
              FH
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent tracking-tight">
                FundiHub
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                Partner
              </span>
            </div>
          )}
        </SidebarHeader>

        {/* Sidebar Navigation Categories - spaced cleanly */}
        <SidebarContent className="px-3 py-6 space-y-6">
          
          {/* Section 1: Main Actions */}
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="px-3 text-[10px] font-medium text-muted-foreground/60">
              Core Operations
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-2 mt-2">
              {menuItems.slice(0, 3).map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setActiveTab(item.id as any)}
                      tooltip={item.label}
                      className="w-full text-sm font-medium rounded-lg cursor-pointer h-10.5 px-3.5 hover:bg-sidebar-accent"
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto rounded-full bg-primary/20 text-primary px-2 py-0.5 text-xs font-medium">
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
            <SidebarMenu className="space-y-2 mt-2">
              {menuItems.slice(3).map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setActiveTab(item.id as any)}
                      tooltip={item.label}
                      className="w-full text-sm font-medium rounded-lg cursor-pointer h-10.5 px-3.5 hover:bg-sidebar-accent"
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto rounded-full bg-primary/20 text-primary px-2 py-0.5 text-xs font-medium">
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
        <SidebarFooter className="p-4 space-y-4 border-t border-border/25 bg-muted/5">
          
          {/* On-Call Status: collapses into pure switch icon with tooltip */}
          {isCollapsed ? (
            <div className="flex justify-center py-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center">
                    <Switch
                      id="emergency-toggle-collapsed"
                      checked={profile?.isEmergency || false}
                      onCheckedChange={() => handleToggleEmergency(profile?.isEmergency)}
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
                <Label htmlFor="emergency-toggle" className="text-xs font-medium text-foreground cursor-pointer">
                  On-Call Status
                </Label>
                <p className="text-[10px] text-muted-foreground font-normal">
                  {profile?.isEmergency ? "Online" : "Offline"}
                </p>
              </div>
              <Switch
                id="emergency-toggle"
                checked={profile?.isEmergency || false}
                onCheckedChange={() => handleToggleEmergency(profile?.isEmergency)}
                className="cursor-pointer"
              />
            </div>
          )}

          <div className={cn(
            "flex border-t border-border/30 pt-3",
            isCollapsed ? "flex-col items-center gap-2.5" : "items-center justify-between"
          )}>
            {mounted && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg h-9 w-9 cursor-pointer"
                    onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  >
                    {resolvedTheme === "dark" ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-zinc-700" />}
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
                    "text-muted-foreground hover:text-destructive cursor-pointer rounded-lg h-9",
                    isCollapsed ? "w-9" : "text-xs font-medium gap-1.5 px-3"
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
      <SidebarInset className="flex-1 flex flex-col min-h-screen">
        
        {/* NORMAL NAVBAR - NO CLUTTER */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-card/85 backdrop-blur-md px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <h2 className="text-sm font-medium text-muted-foreground capitalize">
              {activeTab}
            </h2>
          </div>

          {/* User Details initials indicator */}
          <div className="flex items-center gap-2.5 bg-muted/40 p-1.5 pl-2.5 pr-2.5 border border-border/10 rounded-xl">
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-500 text-white text-xs font-black shadow-xs">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-xs font-bold text-foreground hidden sm:inline">
              {user?.name}
            </span>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-grow max-w-7xl w-full mx-auto px-6 py-8">
          
          {/* OVERVIEW TAB CONTENT */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Header Greeting Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-5">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                    Habari, {user?.name || "Partner"}! 👋
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Welcome to your Partner Suite. You have <span className="font-bold text-primary">{matchingLeads.length} matching job opportunities</span> in {profile?.trade || "your trade"} today.
                  </p>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
                
                {/* Metric: Rating */}
                <Card className="border border-border/60 bg-card hover:shadow-md hover:border-primary/20 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary fill-primary/10" />
                      Satisfaction Rating
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl font-bold text-foreground">{profile?.rating.toFixed(1) || "5.0"}</span>
                      <span className="text-xs text-muted-foreground">/ 5.0</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                      <span className="text-amber-500">★</span>
                      <span>({profile?.reviews || 0} client reviews)</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Metric: Verification Tier */}
                <Card className="border border-border/60 bg-card hover:shadow-md hover:border-primary/20 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Verification Badge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-bold text-foreground mt-1 truncate capitalize">
                      {profile?.premiumLevel === "none" ? "Standard Plan" : profile?.premiumLevel + " Partner"}
                    </div>
                    
                    <div className="flex gap-1.5 mt-2">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase border cursor-pointer ${
                        profile?.premiumLevel === "verified" || profile?.premiumLevel === "top"
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                          : "bg-muted text-muted-foreground border-transparent hover:bg-muted/70"
                      }`}
                      onClick={() => profile?.premiumLevel === "none" && (setPremiumModalType("verified"), setIsPremiumModalOpen(true))}
                      >
                        Verified
                      </span>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase border cursor-pointer ${
                        profile?.premiumLevel === "top"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                          : "bg-muted text-muted-foreground border-transparent hover:bg-muted/70"
                      }`}
                      onClick={() => profile?.premiumLevel !== "top" && (setPremiumModalType("top"), setIsPremiumModalOpen(true))}
                      >
                        Top Rank
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Metric: Completed Jobs */}
                <Card className="border border-border/60 bg-card hover:shadow-md hover:border-primary/20 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Jobs Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-foreground">24</span>
                      <span className="text-xs text-emerald-500 font-bold">+3 completed</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      98% success rating
                    </p>
                  </CardContent>
                </Card>

                {/* Metric: Total Earnings */}
                <Card className="border border-border/60 bg-card hover:shadow-md hover:border-primary/20 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Payout Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mt-1">
                      KES {totalEarnings.toLocaleString()}
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                      <span>Referrals: KES {referralEarnings}</span>
                      <span>Jobs: KES {jobEarnings}</span>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Grid layout splits */}
              <div className="grid gap-6 lg:grid-cols-3">
                
                {/* Left: Client matches feed */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black text-foreground tracking-tight uppercase flex items-center gap-1.5">
                      <Wrench className="h-4 w-4 text-primary" />
                      Matching Client Leads ({matchingLeads.length})
                    </h2>
                    <button
                      onClick={() => setActiveTab("leads")}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      View All Leads <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>

                  {matchingLeads.length > 0 ? (
                    <div className="space-y-4">
                      {matchingLeads.slice(0, 2).map((lead) => (
                        <Card key={lead.id} className="border-border bg-card hover:border-primary/45 transition-all duration-300 shadow-2xs group overflow-hidden">
                          <CardHeader className="pb-3 bg-muted/15 border-b border-border/30 px-5 py-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded bg-primary/10 px-2.5 py-0.5 text-xs font-black text-primary uppercase">
                                    {lead.trade}
                                  </span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
                                    <Clock className="h-3.5 w-3.5" /> {lead.createdAt}
                                  </span>
                                </div>
                                <CardTitle className="text-sm font-bold text-foreground mt-2 tracking-tight group-hover:text-primary transition-colors">
                                  {lead.title}
                                </CardTitle>
                              </div>
                              <span className="text-sm font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1 flex-shrink-0">
                                {lead.budget}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="p-5 space-y-4">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {lead.description}
                            </p>

                            <div className="grid grid-cols-2 gap-3 pt-3 text-xs border-t border-border/20">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="truncate">{lead.location}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="truncate">{lead.urgency}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1 gap-3">
                              <div className="text-xs text-muted-foreground">
                                Client: <span className="font-bold text-foreground">{lead.clientName}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" asChild className="h-8 text-xs font-bold rounded-lg cursor-pointer px-3">
                                  <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5" /> Call
                                  </a>
                                </Button>
                                <Button size="sm" asChild className="h-8 text-xs font-bold rounded-lg cursor-pointer px-3">
                                  <a
                                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${lead.clientName},%2520I%2520saw%2520your%2520lead%2520on%2520FundiHub%252520for%252520'${encodeURIComponent(lead.title)}'%20and%252520I%252520am%252520available.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5"
                                  >
                                    <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
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
                      <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                      <h3 className="text-sm font-bold text-foreground">No matches at the moment</h3>
                      <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        We match incoming projects based on your trade ({profile?.trade || "General"}). Once a client submits a matching request, it will appear here.
                      </p>
                    </Card>
                  )}
                </div>

                {/* Right widgets column */}
                <div className="space-y-5">
                  
                  {/* Profile Completeness: Circular gauge */}
                  <Card className="border border-border/60 bg-card">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-xs font-black tracking-wider uppercase text-foreground">
                        Profile Completeness
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-center p-5 space-y-4">
                      <div className="relative flex items-center justify-center">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="5.5" className="text-muted/65" fill="transparent" />
                          <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="5.5" className="text-primary" fill="transparent"
                            strokeDasharray={213.62}
                            strokeDashoffset={213.62 * (1 - 0.85)}
                          />
                        </svg>
                        <span className="absolute text-base font-black text-foreground">85%</span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground leading-normal">
                        Upload portfolio photos of previous jobs to reach 100% and unlock high-paying client leads.
                      </p>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("profile")}
                        className="w-full text-xs font-bold rounded-xl h-8 cursor-pointer"
                      >
                        Manage Portfolio
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Refer & Earn link code */}
                  <Card className="border border-border/60 bg-card">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-xs font-black tracking-wider uppercase text-foreground">
                        Refer & Earn Link
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-3 space-y-3">
                      <p className="text-xs text-muted-foreground leading-normal">
                        Earn KES 100 instantly for every partner who signs up using your unique link.
                      </p>
                      
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          readOnly
                          value={user ? `${window.location.origin}/auth/signup?ref=${user.id}` : ""}
                          className="flex-1 text-xs bg-muted/60 p-2.5 rounded-lg border border-border/40 font-mono text-muted-foreground outline-hidden select-all min-w-0"
                        />
                        <Button
                          size="sm"
                          onClick={copyReferralLink}
                          className="h-8.5 rounded-lg font-bold text-xs cursor-pointer px-3 flex-shrink-0"
                        >
                          {copiedReferral ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Toolkit downloads */}
                  <Card className="border border-border/60 bg-card">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-xs font-black tracking-wider uppercase text-foreground">
                        Professional Toolkits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 pt-1">
                      <div className="divide-y divide-border/25 text-xs">
                        <a href="#" className="flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground">
                          <span className="flex items-center gap-2.5 font-medium">
                            <Download className="h-4 w-4 text-primary" />
                            Invoice Template (PDF)
                          </span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <a href="#" className="flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground">
                          <span className="flex items-center gap-2.5 font-medium">
                            <HelpCircle className="h-4 w-4 text-primary" />
                            Tax Compliance Guide
                          </span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <a href="tel:+254799112919" className="flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground">
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
          {activeTab === "leads" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4">
                <div>
                  <h1 className="text-xl font-extrabold text-foreground">Client Lead Matches</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">Review, apply, and contact clients looking for {profile?.trade || "General"} services.</p>
                </div>
                <div className="flex gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/20 self-start sm:self-center">
                  <button className="px-3.5 py-1.5 rounded-lg bg-card border border-border text-xs font-black uppercase text-primary">
                    Matching ({matchingLeads.length})
                  </button>
                  <button className="px-3.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground text-xs font-bold uppercase cursor-pointer">
                    Applied (0)
                  </button>
                  <button className="px-3.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground text-xs font-bold uppercase cursor-pointer">
                    Archived (0)
                  </button>
                </div>
              </div>

              {matchingLeads.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2">
                  {matchingLeads.map((lead) => (
                    <Card key={lead.id} className="border-border bg-card hover:border-primary/45 transition-colors shadow-2xs flex flex-col justify-between overflow-hidden">
                      <div>
                        <CardHeader className="pb-3 bg-muted/15 border-b border-border/30 px-5 py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-black text-primary uppercase">
                                  {lead.trade}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
                                  <Clock className="h-3.5 w-3.5" /> {lead.createdAt}
                                </span>
                              </div>
                              <CardTitle className="text-sm font-black text-foreground mt-2 tracking-tight group-hover:text-primary transition-colors">
                                {lead.title}
                              </CardTitle>
                            </div>
                            <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2.5 py-1 flex-shrink-0">
                              {lead.budget}
                            </span>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-5 space-y-4">
                          <p className="text-xs text-muted-foreground leading-normal">
                            {lead.description}
                          </p>

                          <div className="grid grid-cols-2 gap-3 pt-3 text-xs border-t border-border/20">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="truncate">{lead.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="truncate">{lead.urgency}</span>
                            </div>
                          </div>
                        </CardContent>
                      </div>

                      <div className="p-5 bg-muted/10 border-t border-border/25 flex items-center justify-between gap-4">
                        <div className="text-xs text-muted-foreground">
                          Client: <span className="font-bold text-foreground">{lead.clientName}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild className="h-8.5 text-xs font-bold rounded-lg cursor-pointer px-3.5">
                            <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5" /> Call Client
                            </a>
                          </Button>
                          <Button size="sm" asChild className="h-8.5 text-xs font-bold rounded-lg cursor-pointer px-3.5">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${lead.clientName},%2520I%2520saw%2520your%2520lead%2520on%2520FundiHub%252520for%252520'${encodeURIComponent(lead.title)}'%20and%252520I%252520am%252520available.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5"
                            >
                              <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-border bg-card/30 p-12 text-center shadow-2xs">
                  <AlertCircle className="mx-auto h-9 w-9 text-muted-foreground mb-3" />
                  <h3 className="text-sm font-bold text-foreground">No matches at the moment</h3>
                  <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    We match incoming projects based on your skill category ({profile?.trade || "General"}). Once a client submits a request, it will appear here.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* PROFILE & PORTFOLIO TAB CONTENT */}
          {activeTab === "profile" && (() => {
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

            if (!isEditingProfile) {
              return (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Compact Responsive Profile Header Card */}
                  <Card className="border border-border/40 bg-card p-6 shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                        {/* Avatar */}
                        <div className="h-20 w-20 rounded-full border-2 border-border overflow-hidden bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-sm flex-shrink-0">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                          ) : (
                            user?.name?.[0]?.toUpperCase()
                          )}
                        </div>

                        {/* Name and Tagline */}
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-start">
                            <h2 className="text-xl font-extrabold text-foreground">{editName || user?.name || "Fundi Partner"}</h2>
                            {profile?.premiumLevel !== "none" && (
                              <ShieldCheck className="h-4.5 w-4.5 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-foreground font-semibold">
                            {editTitle || `${editTrade || "General"} Specialist`}
                          </p>

                          {/* Quick Action Badges */}
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                            <span className="inline-flex items-center rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-semibold text-primary">
                              {editTrade || "General"}
                            </span>
                            <span className="inline-flex items-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-500">
                              {editYearsExp || "0"} Years Experience
                            </span>
                            <span className="inline-flex items-center rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-500 flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                              {profile?.rating.toFixed(1) || "5.0"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Edit Profile Button */}
                      <div className="flex justify-center md:justify-end w-full md:w-auto">
                        <Button
                          onClick={() => {
                            setWizardStep(1)
                            setIsEditingProfile(true)
                          }}
                          variant="outline"
                          className="h-10 text-sm font-semibold rounded-lg border-border/60 hover:bg-muted cursor-pointer flex items-center gap-2 shadow-xs w-full md:w-auto px-4"
                        >
                          <PenLine className="h-4 w-4" /> Edit Profile
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Profile details grid */}
                  <div className="grid gap-6 md:grid-cols-3">
                    {/* Identity and Service Area */}
                    <Card className="border border-border/40 bg-card p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-border/30 pb-3">
                        <h3 className="text-sm font-bold text-foreground">Identity & Scope</h3>
                        <Button 
                          onClick={() => { setWizardStep(1); setIsEditingProfile(true); }}
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs text-primary font-bold cursor-pointer animate-none hover:bg-transparent"
                        >
                          Edit
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Service Coverage</span>
                          <p className="text-sm text-foreground flex items-center gap-2 font-medium">
                            <MapPin className="h-4 w-4 text-primary" />
                            {editArea || "Not specified"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Preferred Contact</span>
                          <p className="text-sm text-foreground flex items-center gap-2 font-medium capitalize">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            {preferredContact || "whatsapp"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">National ID Status</span>
                          <p className="text-sm text-foreground flex items-center gap-2 font-medium">
                            <Shield className="h-4 w-4 text-primary" />
                            Verified (ID ending in **8)
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* About Story & Skills */}
                    <Card className="border border-border/40 bg-card p-6 space-y-4 md:col-span-2">
                      <div className="flex items-center justify-between border-b border-border/30 pb-3">
                        <h3 className="text-sm font-bold text-foreground">Bio Story & Skills</h3>
                        <Button 
                          onClick={() => { setWizardStep(2); setIsEditingProfile(true); }}
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs text-primary font-bold cursor-pointer animate-none hover:bg-transparent"
                        >
                          Edit
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Professional Bio</span>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {editDesc || "No professional biography added yet. Update your profile step 2 to introduce yourself to clients!"}
                          </p>
                        </div>
                        
                        <div className="space-y-2 pt-1">
                          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Specializations</span>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((tag) => (
                              <span key={tag} className="inline-flex items-center rounded bg-secondary px-3 py-1 text-xs text-secondary-foreground font-medium border border-border/30">
                                {tag}
                              </span>
                            ))}
                            {skills.length === 0 && (
                              <span className="text-sm text-muted-foreground">No specialties selected.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Portfolio section */}
                  <Card className="border border-border/40 bg-card">
                    <CardHeader className="py-4 px-6 border-b border-border/25 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-bold text-foreground">Works Showcase Portfolio ({portfolioItems.length})</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground mt-0.5">Real photos of recent customer repairs and installations you completed.</CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsAddPortfolioOpen(true)}
                        className="h-9 text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="h-4 w-4" /> Add Project
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                      {portfolioItems.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {portfolioItems.map((item) => (
                            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-border/30 bg-muted/20 aspect-video shadow-xs">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent p-3.5 flex flex-col justify-end">
                                <span className="text-xs font-semibold uppercase text-primary tracking-wider">{item.category}</span>
                                <h5 className="text-sm font-bold text-white truncate">{item.title}</h5>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-8 bg-muted/10 rounded-lg border border-dashed border-border/40">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No portfolio photos uploaded.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Guided Profile builder checklist banner */}
                  <Card className="border border-primary/20 bg-primary/5 p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Guided Profile Builder</h4>
                        <p className="text-sm text-muted-foreground">Your profile completion score is {completionScore}%. Complete all details to boost your matching priority.</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setIsEditingProfile(true)}
                      size="sm" 
                      className="text-sm h-10 rounded-lg px-4 cursor-pointer"
                    >
                      {completionScore === 100 ? "Review Wizard Steps" : "Complete Profile Setup"}
                    </Button>
                  </Card>

                  {/* Add Portfolio Dialog */}
                  <Dialog open={isAddPortfolioOpen} onOpenChange={setIsAddPortfolioOpen}>
                    <DialogContent className="border border-border bg-card p-5 rounded-lg shadow-lg w-full max-w-sm">
                      <DialogHeader>
                        <DialogTitle className="text-sm font-bold text-foreground">Add Portfolio Work</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">Showcase pictures of jobs you did recently to attract clients.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePortfolioUpload} className="space-y-4 mt-2">
                        <div className="space-y-1">
                          <Label htmlFor="port-title" className="text-xs font-semibold text-foreground">Project Title</Label>
                          <Input
                            id="port-title"
                            value={newPortfolioTitle}
                            onChange={(e) => setNewPortfolioTitle(e.target.value)}
                            placeholder="e.g. Master kitchen plumbing"
                            required
                            className="text-xs h-9 rounded-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="port-cat" className="text-xs font-semibold text-foreground">Work Category</Label>
                          <select
                            id="port-cat"
                            value={newPortfolioCategory}
                            onChange={(e) => setNewPortfolioCategory(e.target.value)}
                            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-xs focus-visible:outline-hidden dark:bg-card"
                          >
                            <option value="Wiring">Electrical Wiring</option>
                            <option value="Installation">Equipment Installation</option>
                            <option value="Repair">Trouble Repair</option>
                            <option value="Piping">Plumbing Piping</option>
                            <option value="General">Other Works</option>
                          </select>
                        </div>
                        
                        <div className="rounded-lg border border-dashed border-border/40 p-5 text-center bg-muted/15">
                          <ImageIcon className="h-6 w-6 text-primary mx-auto mb-1.5" />
                          <p className="text-[10px] font-bold text-foreground">Select photos of your work</p>
                          <p className="text-[8px] text-muted-foreground mt-0.5">PNG, JPG up to 5MB (Simulated upload)</p>
                        </div>

                        <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-border/30">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsAddPortfolioOpen(false)}
                            className="text-xs h-9 px-4 rounded-lg cursor-pointer"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="text-xs h-9 px-4 rounded-lg font-medium cursor-pointer"
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
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div>
                    <h1 className="text-xl font-extrabold text-foreground">Profile Builder Wizard</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Configure your public identity cards and showcase photos of completed jobs to potential clients.</p>
                  </div>
                  <Button
                    onClick={() => setIsEditingProfile(false)}
                    variant="outline"
                    size="sm"
                    className="h-10 text-sm rounded-lg cursor-pointer px-4"
                  >
                    View Profile Card
                  </Button>
                </div>

                {/* Dynamic Stepper Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-border/40 bg-muted/10 p-4 rounded-xl gap-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setWizardStep(1)}>
                      <span className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold border transition-colors",
                        wizardStep === 1 ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border"
                      )}>1</span>
                      <span className={cn("text-sm font-semibold", wizardStep === 1 ? "text-foreground" : "text-muted-foreground")}>Identity & Contact</span>
                    </div>
                    <div className="hidden sm:block h-px w-6 bg-border" />
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setWizardStep(2)}>
                      <span className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold border transition-colors",
                        wizardStep === 2 ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border"
                      )}>2</span>
                      <span className={cn("text-sm font-semibold", wizardStep === 2 ? "text-foreground" : "text-muted-foreground")}>Bio & Skills</span>
                    </div>
                    <div className="hidden sm:block h-px w-6 bg-border" />
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setWizardStep(3)}>
                      <span className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold border transition-colors",
                        wizardStep === 3 ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border"
                      )}>3</span>
                      <span className={cn("text-sm font-semibold", wizardStep === 3 ? "text-foreground" : "text-muted-foreground")}>Media & Showcase</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1">
                    <span className="text-sm font-semibold text-primary">Completion:</span>
                    <span className="text-sm font-bold text-primary">{completionScore}%</span>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                  
                  {/* Form column (Identity, Bio & Skills, or Media & Gallery) */}
                  <div className="lg:col-span-3 space-y-5">
                    <Card className="border border-border/40 bg-card">
                      <CardHeader className="py-4">
                        <CardTitle className="text-base font-bold text-foreground">
                          {wizardStep === 1 && "Step 1: Professional Information"}
                          {wizardStep === 2 && "Step 2: About & Skills Tags"}
                          {wizardStep === 3 && "Step 3: Photos & Gallery Showcase"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        
                        {/* Step 1: Basic professional information */}
                        {wizardStep === 1 && (
                          <form onSubmit={handleUpdateProfile} className="space-y-4">
                            {updateSuccess && (
                              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-sm text-emerald-500 flex items-center gap-2">
                                <Check className="h-4 w-4" /> <span>{updateSuccess}</span>
                              </div>
                            )}

                            <div className="space-y-1.5">
                              <Label htmlFor="edit-name" className="text-sm font-semibold text-foreground">Full Name</Label>
                              <Input
                                id="edit-name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="e.g. John Doe"
                                className="w-full text-sm h-10 rounded-lg"
                                required
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label htmlFor="edit-title" className="text-sm font-semibold text-foreground">Professional Tagline / Title</Label>
                              <Input
                                id="edit-title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="e.g. Master Plumber & Piping Expert"
                                className="w-full text-sm h-10 rounded-lg"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <Label htmlFor="edit-trade" className="text-sm font-semibold text-foreground">Primary Trade</Label>
                                <Input
                                  id="edit-trade"
                                  value={editTrade}
                                  disabled
                                  className="w-full text-sm h-10 rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="edit-exp" className="text-sm font-semibold text-foreground">Experience (Years)</Label>
                                <Input
                                  id="edit-exp"
                                  value={editYearsExp}
                                  onChange={(e) => setEditYearsExp(e.target.value)}
                                  placeholder="e.g. 5 Years"
                                  className="w-full text-sm h-10 rounded-lg"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <Label htmlFor="edit-area" className="text-sm font-semibold text-foreground">Service Area Coverage</Label>
                                <Input
                                  id="edit-area"
                                  value={editArea}
                                  onChange={(e) => setEditArea(e.target.value)}
                                  placeholder="e.g. Nairobi, Kilimani & Westlands"
                                  className="w-full text-sm h-10 rounded-lg"
                                  required
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="preferred-contact" className="text-sm font-semibold text-foreground">Contact Preference</Label>
                                <select
                                  id="preferred-contact"
                                  value={preferredContact}
                                  onChange={(e) => setPreferredContact(e.target.value)}
                                  className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-hidden dark:bg-card"
                                >
                                  <option value="whatsapp">WhatsApp Texting</option>
                                  <option value="phone">Direct Phone Call</option>
                                  <option value="email">Email Inquiry</option>
                                </select>
                              </div>
                            </div>

                            <Button
                              type="submit"
                              disabled={isUpdating}
                              className="w-full font-semibold h-10 text-sm rounded-lg cursor-pointer mt-1"
                            >
                              {isUpdating ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving Details...
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
                              <Label htmlFor="edit-desc" className="text-sm font-semibold text-foreground">Professional Description / Bio</Label>
                              <textarea
                                id="edit-desc"
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                placeholder="Describe your expertise, typical jobs you take..."
                                className="flex min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/10"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-foreground">Skills / Specialty Badges</Label>
                              <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border/40 bg-muted/10 min-h-12">
                                {skills.map((tag) => (
                                  <span key={tag} className="inline-flex items-center gap-1.5 rounded bg-secondary px-3 py-1 text-sm text-secondary-foreground font-medium border border-border/30">
                                    {tag}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSkill(tag)}
                                      className="text-muted-foreground hover:text-destructive cursor-pointer"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </span>
                                ))}
                                {skills.length === 0 && (
                                  <span className="text-sm text-muted-foreground">No specialty badges added yet.</span>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                <Input
                                  value={newSkillInput}
                                  onChange={(e) => setNewSkillInput(e.target.value)}
                                  placeholder="e.g. Toilet Repair, Leak Tracing"
                                  className="text-sm h-10"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
                                        setSkills(prev => [...prev, newSkillInput.trim()]);
                                        setNewSkillInput("");
                                      }
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  onClick={() => {
                                    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
                                      setSkills(prev => [...prev, newSkillInput.trim()]);
                                      setNewSkillInput("");
                                    }
                                  }}
                                  size="sm"
                                  className="h-10 px-4 rounded-lg text-sm font-semibold"
                                >
                                  Add
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/30">
                              <Button type="button" variant="outline" onClick={() => setWizardStep(1)} className="text-sm h-10 rounded-lg px-4">
                                Back
                              </Button>
                              <Button
                                type="button"
                                onClick={async () => {
                                  setIsUpdating(true)
                                  try {
                                    await fetch("/api/fundi/profile", {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ description: editDesc })
                                    })
                                    setWizardStep(3)
                                  } catch(e) {
                                    console.error(e)
                                  } finally {
                                    setIsUpdating(false)
                                  }
                                }}
                                className="text-sm h-10 rounded-lg px-6"
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
                            <div className="rounded-lg border border-border p-5 bg-muted/10 space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-foreground">1. Face Avatar Photo</h4>
                                {avatarDone && <span className="text-xs text-emerald-500 font-semibold">Completed</span>}
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-full border border-border/40 overflow-hidden flex items-center justify-center bg-muted flex-shrink-0">
                                  {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar Preview" className="h-full w-full object-cover" />
                                  ) : (
                                    <span className="text-xl font-black text-muted-foreground">{user?.name?.[0]?.toUpperCase()}</span>
                                  )}
                                  {isAvatarUploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-white font-bold">
                                      {avatarProgress}%
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 space-y-2">
                                  <p className="text-sm text-muted-foreground leading-normal">Configure a high quality face picture for your public search listings.</p>
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
                                      className="h-10 text-sm font-semibold cursor-pointer"
                                      asChild
                                    >
                                      <label htmlFor="avatar-upload-file" className="cursor-pointer flex items-center gap-1.5 px-4">
                                        <Camera className="h-4 w-4" />
                                        {isAvatarUploading ? "Uploading..." : "Upload Avatar"}
                                      </label>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              {isAvatarUploading && (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                                    <span>Transferring picture...</span>
                                    <span>{avatarProgress}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all duration-150" style={{ width: `${avatarProgress}%` }} />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* 2. Portfolio manager */}
                            <div className="rounded-lg border border-border p-5 bg-muted/10 space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-foreground">2. Project Showcase Photos</h4>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setIsAddPortfolioOpen(true)}
                                  className="h-9 text-xs font-semibold rounded-lg cursor-pointer"
                                >
                                  + Add Project
                                </Button>
                              </div>

                              {isPortfolioUploading && (
                                <div className="rounded-lg border border-border/40 bg-card p-4 space-y-2.5">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                      <FileCheck className="h-5 w-5 text-primary flex-shrink-0 animate-bounce" />
                                      <div className="min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate">{uploadFileName}</p>
                                        <p className="text-xs text-muted-foreground">{uploadFileSize}</p>
                                      </div>
                                    </div>
                                    <span className="text-sm font-bold text-primary">{portfolioProgress}%</span>
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                      <div className="h-full bg-primary rounded-full transition-all duration-75" style={{ width: `${portfolioProgress}%` }} />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Uploading project work mockup photo...</p>
                                  </div>
                                </div>
                              )}

                              {portfolioItems.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 pt-1">
                                  {portfolioItems.map((item) => (
                                    <div key={item.id} className="group relative rounded-lg overflow-hidden border border-border/30 bg-muted/20 aspect-video">
                                      <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent p-3 flex flex-col justify-end">
                                        <span className="text-xs font-semibold uppercase text-primary tracking-wider">{item.category}</span>
                                        <h5 className="text-sm font-bold text-white truncate">{item.title}</h5>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center p-6 bg-card rounded-lg border border-dashed border-border/40">
                                  <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-1.5" />
                                  <p className="text-sm text-muted-foreground">No portfolio photos uploaded.</p>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/30">
                              <Button type="button" variant="outline" onClick={() => setWizardStep(2)} className="text-sm h-10 rounded-lg px-4">
                                Back
                              </Button>
                              <Button
                                type="button"
                                onClick={() => {
                                  setUpdateSuccess("All wizard profile configurations saved successfully!");
                                  setTimeout(() => setUpdateSuccess(""), 4000);
                                  setIsEditingProfile(false);
                                }}
                                className="text-sm h-10 rounded-lg px-6"
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
                  <div className="lg:col-span-2 space-y-5">
                    
                    {/* Completion Checklist */}
                    <Card className="border border-border/60 bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-foreground">
                          Profile Task Checklist
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-1 space-y-3">
                        <div className="flex items-center justify-between text-xs border-b border-border/25 pb-2 mb-2">
                          <span className="text-muted-foreground">Completeness Score:</span>
                          <span className="font-bold text-primary">{completionScore}%</span>
                        </div>
                        
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className={cn("flex items-center gap-2", basicInfoDone ? "text-foreground" : "text-muted-foreground")}>
                              <CheckCircle2 className={cn("h-4 w-4 transition-all duration-300", basicInfoDone ? "text-emerald-500 fill-emerald-500/10" : "text-muted-foreground/40")} />
                              Basic Identity Details
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">20%</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className={cn("flex items-center gap-2", serviceAreaDone ? "text-foreground" : "text-muted-foreground")}>
                              <CheckCircle2 className={cn("h-4 w-4 transition-all duration-300", serviceAreaDone ? "text-emerald-500 fill-emerald-500/10" : "text-muted-foreground/40")} />
                              Service scope & exp
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">20%</span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className={cn("flex items-center gap-2", bioDone ? "text-foreground" : "text-muted-foreground")}>
                              <CheckCircle2 className={cn("h-4 w-4 transition-all duration-300", bioDone ? "text-emerald-500 fill-emerald-500/10" : "text-muted-foreground/40")} />
                              Detailed Bio Story
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">20%</span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className={cn("flex items-center gap-2", preferredContactDone ? "text-foreground" : "text-muted-foreground")}>
                              <CheckCircle2 className={cn("h-4 w-4 transition-all duration-300", preferredContactDone ? "text-emerald-500 fill-emerald-500/10" : "text-muted-foreground/40")} />
                              Contact Preference
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">15%</span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className={cn("flex items-center gap-2", avatarDone ? "text-foreground" : "text-muted-foreground")}>
                              <CheckCircle2 className={cn("h-4 w-4 transition-all duration-300", avatarDone ? "text-emerald-500 fill-emerald-500/10" : "text-muted-foreground/40")} />
                              Avatar Photo uploaded
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">15%</span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className={cn("flex items-center gap-2", portfolioDone ? "text-foreground animate-in" : "text-muted-foreground")}>
                              <CheckCircle2 className={cn("h-4 w-4 transition-all duration-300", portfolioDone ? "text-emerald-500 fill-emerald-500/10" : "text-muted-foreground/40")} />
                              Portfolio Showcase photo
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">10%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Public Card Preview */}
                    <Card className="border border-border/40 bg-gradient-to-b from-card to-muted/15 relative overflow-hidden">
                      <CardHeader className="py-3.5 border-b border-border/25">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xs font-semibold text-foreground">Public Card Preview</CardTitle>
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-500 uppercase tracking-wide">
                            Active Listing
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full border border-border/40 overflow-hidden bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                              user?.name?.[0]?.toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-sm text-foreground">{editName || user?.name}</h4>
                              {profile?.premiumLevel !== "none" && (
                                <ShieldCheck className="h-4 w-4 text-blue-500" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground font-semibold">{editTitle || `${editTrade} Specialist`}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                            {editTrade}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-primary" /> {editArea || "Nairobi"}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {profile?.rating.toFixed(1)} ({profile?.reviews || 0} reviews)
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed border-t border-border/20 pt-2.5">
                          {editDesc || "No description set yet. Write a professional description in Step 2 to describe your skills."}
                        </p>
                      </CardContent>
                    </Card>

                  </div>

                </div>

                {/* Add Portfolio Dialog */}
                <Dialog open={isAddPortfolioOpen} onOpenChange={setIsAddPortfolioOpen}>
                  <DialogContent className="border border-border bg-card p-5 rounded-lg shadow-lg w-full max-w-sm">
                    <DialogHeader>
                      <DialogTitle className="text-sm font-bold text-foreground">Add Portfolio Work</DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground">Showcase pictures of jobs you did recently to attract clients.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePortfolioUpload} className="space-y-4 mt-2">
                      <div className="space-y-1">
                        <Label htmlFor="port-title" className="text-xs font-semibold text-foreground">Project Title</Label>
                        <Input
                          id="port-title"
                          value={newPortfolioTitle}
                          onChange={(e) => setNewPortfolioTitle(e.target.value)}
                          placeholder="e.g. Master kitchen plumbing"
                          required
                          className="text-xs h-9 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="port-cat" className="text-xs font-semibold text-foreground">Work Category</Label>
                        <select
                          id="port-cat"
                          value={newPortfolioCategory}
                          onChange={(e) => setNewPortfolioCategory(e.target.value)}
                          className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-xs focus-visible:outline-hidden dark:bg-card"
                        >
                          <option value="Wiring">Electrical Wiring</option>
                          <option value="Installation">Equipment Installation</option>
                          <option value="Repair">Trouble Repair</option>
                          <option value="Piping">Plumbing Piping</option>
                          <option value="General">Other Works</option>
                        </select>
                      </div>
                      
                      <div className="rounded-lg border border-dashed border-border/40 p-5 text-center bg-muted/15">
                        <ImageIcon className="h-6 w-6 text-primary mx-auto mb-1.5" />
                        <p className="text-[10px] font-bold text-foreground">Select photos of your work</p>
                        <p className="text-[8px] text-muted-foreground mt-0.5">PNG, JPG up to 5MB (Simulated upload)</p>
                      </div>

                      <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-border/30">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsAddPortfolioOpen(false)}
                          className="text-xs h-9 px-4 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="text-xs h-9 px-4 rounded-lg font-medium cursor-pointer"
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
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="border-b border-border/40 pb-4">
                <h1 className="text-xl font-extrabold text-foreground">Referrals & Rewards</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Monitor your invite lists, copy registration links, and track your wallet payout statistics.</p>
              </div>

              {/* Stats overview cards row */}
              <div className="grid gap-4 grid-cols-3">
                <Card className="border border-border/40 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="p-4">
                    <div className="text-xs font-black text-muted-foreground uppercase tracking-wider">Total Referred</div>
                    <div className="text-lg font-black text-foreground mt-1.5">{referralCount} Partners</div>
                  </CardContent>
                </Card>

                <Card className="border border-border/40 bg-gradient-to-br from-emerald-500/5 to-transparent">
                  <CardContent className="p-4">
                    <div className="text-xs font-black text-muted-foreground uppercase tracking-wider">Pending Payout</div>
                    <div className="text-lg font-black text-foreground mt-1.5">
                      {user?.referrals?.filter((r: any) => r.status === "pending" || r.status === "registered").length || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border/40 bg-gradient-to-br from-blue-500/5 to-transparent">
                  <CardContent className="p-4">
                    <div className="text-xs font-black text-muted-foreground uppercase tracking-wider">Withdrawn Earnings</div>
                    <div className="text-lg font-black text-foreground mt-1.5">KES {referralEarnings}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Refer link widgets grid */}
              <div className="grid gap-6 md:grid-cols-5">
                
                {/* Refer code card */}
                <div className="md:col-span-3 space-y-5">
                  <Card className="border border-border/40 bg-card">
                    <CardHeader className="py-4">
                      <CardTitle className="text-sm font-bold text-foreground">Your Referral Link</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={user ? `${window.location.origin}/auth/signup?ref=${user.id}` : ""}
                          className="flex-grow text-xs bg-muted p-3 rounded-lg border border-border/30 font-mono text-muted-foreground outline-hidden select-all"
                        />
                        <Button
                          onClick={copyReferralLink}
                          className="h-10 px-4 rounded-lg font-bold text-xs cursor-pointer flex-shrink-0"
                        >
                          {copiedReferral ? "Copied!" : "Copy"}
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs font-bold text-muted-foreground uppercase mr-1">Quick Share:</span>
                        <Button size="xs" variant="outline" className="rounded-md h-7 text-xs font-bold cursor-pointer" asChild>
                          <a
                            href={`https://wa.me/?text=Hello!%20Join%20FundiHub%2520as%2520a%2520skilled%2520fundi%2520using%2520my%2520link%2520and%252520start%252520getting%252520direct%252520jobs:%20${encodeURIComponent(user ? `${window.location.origin}/auth/signup?ref=${user.id}` : "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        </Button>
                        <Button size="xs" variant="outline" className="rounded-md h-7 text-xs font-bold cursor-pointer" asChild>
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
                  <Card className="border border-border/40 bg-card overflow-hidden">
                    <CardHeader className="py-4 border-b border-border/30">
                      <CardTitle className="text-xs font-bold text-foreground">Referral History Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {user?.referrals?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-muted/20 text-muted-foreground border-b border-border/35 font-bold">
                                <th className="p-3.5">Referee Name</th>
                                <th className="p-3.5">Trade</th>
                                <th className="p-3.5">Status</th>
                                <th className="p-3.5 text-right">Commission</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/25">
                              {user.referrals.map((ref: any) => (
                                <tr key={ref.id} className="hover:bg-muted/10">
                                  <td className="p-3.5 font-bold text-foreground">{ref.refereeName}</td>
                                  <td className="p-3.5 text-muted-foreground capitalize">{ref.refereeTrade}</td>
                                  <td className="p-3.5">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase ${
                                      ref.status === "paid"
                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/15"
                                        : ref.status === "registered"
                                        ? "bg-blue-500/10 text-blue-500 border border-blue-500/15"
                                        : "bg-amber-500/10 text-amber-500 border border-amber-500/15"
                                    }`}>
                                      {ref.status}
                                    </span>
                                  </td>
                                  <td className="p-3.5 text-right font-black text-foreground">KES {ref.commission}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center p-8 text-muted-foreground space-y-2">
                          <Info className="h-6 w-6 text-muted-foreground mx-auto" />
                          <p className="text-xs">No referrals logged. Share your link to start earning!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Earnings Chart sidebar column */}
                <div className="md:col-span-2 space-y-5">
                  <Card className="border border-border/40 bg-card">
                    <CardHeader className="py-4 border-b border-border/30">
                      <CardTitle className="text-xs font-black tracking-wider uppercase text-foreground">Weekly Payout Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-5">
                      
                      {/* Compact pure CSS Bar Chart */}
                      <div className="h-28 flex items-end justify-between gap-3.5 pt-1">
                        <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div className="w-full bg-muted rounded-t-md h-[10%] relative group cursor-pointer hover:bg-primary/20 transition-colors">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-popover text-[8px] text-popover-foreground px-1.5 py-0.5 rounded-sm border border-border shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">KES 100</span>
                          </div>
                          <span className="text-[9px] text-muted-foreground font-bold">W1</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div className="w-full bg-primary/40 rounded-t-md h-[40%] relative group cursor-pointer hover:bg-primary/60 transition-colors">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-popover text-[8px] text-popover-foreground px-1.5 py-0.5 rounded-sm border border-border shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">KES 400</span>
                          </div>
                          <span className="text-[9px] text-muted-foreground font-bold">W2</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div className="w-full bg-primary/80 rounded-t-md h-[75%] relative group cursor-pointer hover:bg-primary transition-colors">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-popover text-[8px] text-popover-foreground px-1.5 py-0.5 rounded-sm border border-border shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">KES 750</span>
                          </div>
                          <span className="text-[9px] text-muted-foreground font-bold">W3</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div className="w-full bg-primary rounded-t-md h-[95%] relative group cursor-pointer hover:bg-primary transition-colors">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-popover text-[8px] text-popover-foreground px-1.5 py-0.5 rounded-sm border border-border shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">KES 950</span>
                          </div>
                          <span className="text-[9px] text-muted-foreground font-bold">W4</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2.5 border-t border-border/25 text-xs text-muted-foreground leading-normal">
                        <div className="flex items-center justify-between font-bold text-foreground">
                          <span>Promotion Payouts:</span>
                          <span className="text-primary font-black">KES 100 / sign-up</span>
                        </div>
                        <p>Referral payouts transfer automatically to your registered MPesa mobile number on Friday mornings.</p>
                      </div>

                    </CardContent>
                  </Card>
                </div>

              </div>

            </div>
          )}

          {/* MEMBERSHIP BENEFITS TAB CONTENT */}
          {activeTab === "membership" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="border-b border-border/40 pb-4">
                <h1 className="text-xl font-extrabold text-foreground">Membership & Boost Tiers</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Upgrade your profile tier package to build massive customer trust and listing priority.</p>
              </div>

              {/* Pricing Cards Layout (Max-width container, more compact height) */}
              <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto pt-3">
                
                {/* Package: Verified Trust Tick */}
                <Card className={`border relative overflow-hidden transition-all duration-200 hover:shadow-md ${
                  profile?.premiumLevel === "verified"
                    ? "border-blue-500/50 bg-blue-500/5"
                    : "border-border bg-card"
                }`}>
                  <CardHeader className="text-center pb-3 pt-6 px-4">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 rounded-full px-3 py-1 mx-auto w-max mb-3">
                      Trust Tick
                    </span>
                    <CardTitle className="text-lg font-black text-foreground">Verified Badge Tick</CardTitle>
                    <CardDescription className="text-xs mt-1">Get verified instantly and earn consumer trust</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-5 px-4 pb-6">
                    <div className="space-y-1">
                      <span className="text-3xl font-black text-foreground">KES 300</span>
                      <span className="text-xs text-muted-foreground"> / month</span>
                    </div>

                    <div className="space-y-2.5 text-left text-xs text-muted-foreground max-w-[230px] mx-auto py-4 border-t border-b border-border/30">
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span>Displays Blue Verified checkmark icon</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span>30% boost in search clicks</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span>Premium Client Support Access</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setPremiumModalType("verified")
                        setIsPremiumModalOpen(true)
                      }}
                      disabled={profile?.premiumLevel === "verified" || profile?.premiumLevel === "top"}
                      className="w-full rounded-lg font-bold cursor-pointer h-10 text-xs"
                    >
                      {profile?.premiumLevel === "verified" || profile?.premiumLevel === "top" ? "Tier Active" : "Activate Verified Tick"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Package: Top Ranked visibility */}
                <Card className={`border relative overflow-hidden transition-all duration-200 hover:shadow-md ${
                  profile?.premiumLevel === "top"
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-border bg-card"
                }`}>
                  <div className="absolute top-0 right-0 bg-amber-500 text-white font-black text-[8px] uppercase tracking-wider px-3 py-1 rounded-bl-lg shadow-xs">
                    Popular
                  </div>
                  <CardHeader className="text-center pb-3 pt-6 px-4">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 rounded-full px-3 py-1 mx-auto w-max mb-3">
                      Elite Ranking
                    </span>
                    <CardTitle className="text-lg font-black text-foreground">Top-Rank Verified Elite</CardTitle>
                    <CardDescription className="text-xs mt-1">Propel your card to top results</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-5 px-4 pb-6">
                    <div className="space-y-1">
                      <span className="text-3xl font-black text-foreground">KES 500</span>
                      <span className="text-xs text-muted-foreground"> / month</span>
                    </div>

                    <div className="space-y-2.5 text-left text-xs text-muted-foreground max-w-[230px] mx-auto py-4 border-t border-b border-border/30">
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <span>Verified Badge tick displays</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <span>Top row sorting priority</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <span>Up to 5x higher client leads</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setPremiumModalType("top")
                        setIsPremiumModalOpen(true)
                      }}
                      disabled={profile?.premiumLevel === "top"}
                      className="w-full rounded-lg font-bold cursor-pointer h-10 text-xs"
                    >
                      {profile?.premiumLevel === "top" ? "Tier Active" : "Upgrade to Top Partner"}
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
        <DialogContent className="border border-border bg-card p-5 rounded-lg shadow-lg w-full max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-primary animate-pulse" /> Activate Visibility Tier
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Boost your profile discovery rating and gain customer trust.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 border-t border-b border-border/30 my-2">
            <div className="rounded-lg bg-muted/40 border border-border/40 p-3.5 text-center space-y-1.5">
              <span className="text-[9px] font-black text-muted-foreground tracking-wider uppercase">
                {premiumModalType === "verified" ? "Verified Trust Tick" : "Top & Verified Tier"}
              </span>
              <div className="text-2xl font-black text-primary">
                {premiumModalType === "verified" ? "Ksh 300 / mo" : "Ksh 500 / mo"}
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                {premiumModalType === "verified"
                  ? "Displays a verified trust tick icon on your profile search card, building immediate credibility."
                  : "Propels your profile listing to the top of category searches, giving you 5x more customer leads."}
              </p>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground leading-normal bg-primary/5 rounded-lg p-3 border border-primary/10">
              <div className="flex gap-1.5">
                <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span>Immediate badge activation on profile search</span>
              </div>
              <div className="flex gap-1.5">
                <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span>Cancel or pause your subscription badge any time</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPremiumModalOpen(false)}
              className="text-xs h-9.5 px-4 rounded-lg cursor-pointer text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleActivateBadge}
              disabled={isProcessingPayment}
              className="text-xs h-9.5 px-4 rounded-lg font-bold cursor-pointer"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Activating...
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
