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
  Menu,
  X,
  ChevronRight,
  Sparkles,
  TrendingUp,
  FolderKanban,
  HelpCircle,
  CheckCircle2,
  Image as ImageIcon,
  Info,
  Sun,
  Moon,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"

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

export default function FundiDashboard() {
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Portfolio local state
  const [portfolioItems, setPortfolioItems] = useState(INITIAL_PORTFOLIO_ITEMS)
  const [newPortfolioTitle, setNewPortfolioTitle] = useState("")
  const [newPortfolioCategory, setNewPortfolioCategory] = useState("General")
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false)

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
          description: editDesc
        })
      })

      if (response.ok) {
        setUpdateSuccess("Profile updated successfully!")
        fetchProfile()
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
        <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
          Loading your FundiHub Profile...
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
    <div className="flex min-h-screen bg-[oklch(0.99_0.002_30)] dark:bg-[oklch(0.13_0.002_30)] text-foreground transition-colors duration-300">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 border-r border-border/40 bg-card/45 backdrop-blur-lg">
        <div className="flex flex-col flex-grow pt-4 pb-4 overflow-y-auto">
          {/* Logo brand */}
          <div className="flex items-center flex-shrink-0 px-5 gap-1.5">
            <span className="text-lg font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent tracking-tight">
              FundiHub
            </span>
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] font-black text-primary uppercase">
              Pro
            </span>
          </div>

          {/* User info panel in sidebar */}
          <div className="mt-5 px-3">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/30 border border-border/10">
              <div className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-500 text-white text-xs font-black shadow-xs relative flex-shrink-0">
                {user?.name?.[0]?.toUpperCase() || "F"}
                {profile?.premiumLevel !== "none" && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[7px] border border-white dark:border-zinc-900">
                    ✓
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-foreground truncate">{user?.name}</p>
                <p className="text-[9px] text-muted-foreground truncate">{profile?.title || "Partner Partner"}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 flex-1 px-2 space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any)
                    setIsMobileSidebarOpen(false)
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 text-[11px] font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-primary/10 border border-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="rounded-full bg-primary/20 text-primary px-1.5 py-0.5 text-[9px] font-extrabold">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="flex-shrink-0 flex border-t border-border/30 p-3 bg-muted/10">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg h-7 w-7 cursor-pointer"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  title="Toggle Mode"
                >
                  {resolvedTheme === "dark" ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-zinc-700" />}
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-[10px] font-bold text-muted-foreground hover:text-destructive gap-1 cursor-pointer rounded-lg h-7 px-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER BAR */}
      <div className="md:hidden flex flex-col flex-1">
        <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-3 border-b border-border/40 bg-card/85 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1 rounded-md border border-border/50 hover:bg-muted text-foreground"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
            <span className="text-base font-black bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              FundiHub
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-1 rounded-md hover:bg-muted text-foreground transition-colors"
              >
                {resolvedTheme === "dark" ? <Sun className="h-3.5 w-3.5 text-amber-500" /> : <Moon className="h-3.5 w-3.5 text-zinc-700" />}
              </button>
            )}
            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px]">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>
      </div>

      {/* MOBILE DRAWER SIDEBAR */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
          />

          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card border-r border-border">
            <div className="absolute top-0 right-0 -mr-10 pt-4">
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-8 w-8 rounded-full bg-black/40 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 h-0 pt-4 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 gap-1.5">
                <span className="text-lg font-black text-primary">FundiHub</span>
                <span className="rounded bg-primary/15 px-1 py-0.5 text-[8px] font-bold text-primary uppercase">Partner</span>
              </div>
              <nav className="mt-4 px-2 space-y-0.5">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any)
                        setIsMobileSidebarOpen(false)
                      }}
                      className={`group flex items-center justify-between w-full px-3 py-2 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary/10 text-primary border-l-3 border-primary"
                          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="rounded-full bg-primary/20 text-primary px-1.5 py-0.5 text-[9px] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="flex-shrink-0 flex border-t border-border p-3.5 bg-muted/10">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-grow md:pl-56 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
          
          {/* OVERVIEW TAB CONTENT */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Header Greeting Bar (Replaces the huge cluttered banner) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/40 pb-4">
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-1.5">
                    Habari, {user?.name || "Partner"}! 👋
                  </h1>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    You have <span className="font-bold text-primary">{matchingLeads.length} matching job opportunities</span> in {profile?.trade || "your trade"} today.
                  </p>
                </div>
                
                {/* Compact On-Call Status toggle */}
                <div className="flex items-center gap-2.5 bg-card/65 border border-border/50 rounded-xl px-3 py-1.5 shadow-2xs self-start sm:self-center">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    On-Call
                  </span>
                  <button
                    onClick={() => handleToggleEmergency(profile?.isEmergency)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      profile?.isEmergency ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        profile?.isEmergency ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${
                    profile?.isEmergency ? "text-emerald-500 animate-pulse" : "text-muted-foreground"
                  }`}>
                    {profile?.isEmergency ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              {/* Compact Statistics Grid (Refined spacing and smaller typography) */}
              <div className="grid gap-3.5 grid-cols-2 lg:grid-cols-4">
                
                {/* Metric: Rating */}
                <Card className="border-border/60 bg-card/40 hover:shadow-xs hover:border-primary/20 transition-all">
                  <CardContent className="p-3.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-wider">
                      <Star className="h-3 w-3 text-primary fill-primary/10" />
                      Client Satisfaction
                    </div>
                    <div className="flex items-baseline gap-1 mt-1.5">
                      <span className="text-xl font-black text-foreground">{profile?.rating.toFixed(1) || "5.0"}</span>
                      <span className="text-[10px] text-muted-foreground">/ 5.0</span>
                    </div>
                    <div className="text-[9px] text-muted-foreground mt-1 flex items-center gap-1">
                      <span className="flex text-amber-500">★</span>
                      <span>({profile?.reviews || 0} reviews)</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Metric: Account Tier */}
                <Card className="border-border/60 bg-card/40 hover:shadow-xs hover:border-primary/20 transition-all">
                  <CardContent className="p-3.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-wider">
                      <Shield className="h-3 w-3 text-primary" />
                      Verification Tier
                    </div>
                    <div className="text-xs font-black text-foreground mt-2 truncate capitalize">
                      {profile?.premiumLevel === "none" ? "Standard Plan" : profile?.premiumLevel + " Partner"}
                    </div>
                    
                    <div className="flex gap-1 mt-1.5">
                      <span className={`rounded-sm px-1.5 py-0.5 text-[7px] font-extrabold uppercase tracking-wide border ${
                        profile?.premiumLevel === "verified" || profile?.premiumLevel === "top"
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                          : "bg-muted text-muted-foreground border-transparent hover:bg-muted/70 cursor-pointer"
                      }`}
                      onClick={() => profile?.premiumLevel === "none" && (setPremiumModalType("verified"), setIsPremiumModalOpen(true))}
                      >
                        Verified
                      </span>
                      <span className={`rounded-sm px-1.5 py-0.5 text-[7px] font-extrabold uppercase tracking-wide border ${
                        profile?.premiumLevel === "top"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                          : "bg-muted text-muted-foreground border-transparent hover:bg-muted/70 cursor-pointer"
                      }`}
                      onClick={() => profile?.premiumLevel !== "top" && (setPremiumModalType("top"), setIsPremiumModalOpen(true))}
                      >
                        Top Rank
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Metric: Completed Jobs */}
                <Card className="border-border/60 bg-card/40 hover:shadow-xs hover:border-primary/20 transition-all">
                  <CardContent className="p-3.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-wider">
                      <Briefcase className="h-3 w-3 text-primary" />
                      Completed Jobs
                    </div>
                    <div className="flex items-baseline gap-1 mt-1.5">
                      <span className="text-xl font-black text-foreground">24</span>
                      <span className="text-[10px] text-emerald-500 font-bold">+3 new</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-1.5">
                      98% success rating
                    </p>
                  </CardContent>
                </Card>

                {/* Metric: Total Earnings */}
                <Card className="border-border/60 bg-card/40 hover:shadow-xs hover:border-primary/20 transition-all">
                  <CardContent className="p-3.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-wider">
                      <DollarSign className="h-3 w-3 text-primary" />
                      Total Earnings
                    </div>
                    <div className="text-xl font-black text-foreground mt-1.5">
                      KES {totalEarnings.toLocaleString()}
                    </div>
                    <div className="flex justify-between text-[8px] text-muted-foreground mt-1.5">
                      <span>Ref: KES {referralEarnings}</span>
                      <span>Jobs: KES {jobEarnings}</span>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Grid split: Left Column = recommended matches, Right Column = widgets */}
              <div className="grid gap-5 lg:grid-cols-3">
                
                {/* Leads Matching Feed (Refined visual style, smaller cards, no clutter) */}
                <div className="lg:col-span-2 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black text-foreground tracking-tight uppercase flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5 text-primary" />
                      Matching Leads ({matchingLeads.length})
                    </h2>
                    <button
                      onClick={() => setActiveTab("leads")}
                      className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      View Full Inbox <ChevronRight className="h-2.5 w-2.5" />
                    </button>
                  </div>

                  {matchingLeads.length > 0 ? (
                    <div className="space-y-3">
                      {matchingLeads.slice(0, 2).map((lead) => (
                        <Card key={lead.id} className="border-border bg-card hover:border-primary/40 transition-colors shadow-2xs group overflow-hidden">
                          <CardHeader className="pb-2 bg-muted/15 border-b border-border/30 px-4 py-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[8px] font-black text-primary uppercase">
                                    {lead.trade}
                                  </span>
                                  <span className="text-[8px] text-muted-foreground flex items-center gap-0.5 font-semibold">
                                    <Clock className="h-2.5 w-2.5" /> {lead.createdAt}
                                  </span>
                                </div>
                                <CardTitle className="text-xs font-bold text-foreground mt-1.5 tracking-tight group-hover:text-primary transition-colors">
                                  {lead.title}
                                </CardTitle>
                              </div>
                              <span className="text-[11px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2 py-0.5 flex-shrink-0">
                                {lead.budget}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 space-y-3">
                            <p className="text-[11px] text-muted-foreground leading-normal">
                              {lead.description}
                            </p>

                            <div className="grid grid-cols-2 gap-2 pt-2 text-[9px] border-t border-border/20">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                                <span className="truncate">{lead.location}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3 w-3 text-primary flex-shrink-0" />
                                <span className="truncate">{lead.urgency}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1 gap-3">
                              <div className="text-[9px] text-muted-foreground">
                                Client: <span className="font-bold text-foreground">{lead.clientName}</span>
                              </div>
                              <div className="flex gap-1.5">
                                <Button size="xs" variant="outline" asChild className="h-7 text-[9px] font-bold rounded-lg cursor-pointer px-2">
                                  <a href={`tel:${lead.phone}`} className="flex items-center gap-1">
                                    <Phone className="h-2.5 w-2.5" /> Call
                                  </a>
                                </Button>
                                <Button size="xs" asChild className="h-7 text-[9px] font-bold rounded-lg cursor-pointer px-2">
                                  <a
                                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${lead.clientName},%20I%20saw%20your%2520lead%2520on%2520FundiHub%2520for%2520'${encodeURIComponent(lead.title)}'%20and%2520I%2520am%2520available.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1"
                                  >
                                    <MessageSquare className="h-2.5 w-2.5" /> WhatsApp
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-border bg-card/30 p-6 text-center shadow-2xs">
                      <AlertCircle className="mx-auto h-7 w-7 text-muted-foreground mb-2" />
                      <h3 className="text-xs font-bold text-foreground">No matches at the moment</h3>
                      <p className="mt-1 text-[10px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
                        We match incoming projects based on your trade ({profile?.trade || "General"}). Once a client submits a matching request, it will appear here.
                      </p>
                    </Card>
                  )}
                </div>

                {/* Right Column widgets (Linear completeness, slimmed copier and toolkits) */}
                <div className="space-y-4">
                  
                  {/* Widget: Profile Completeness (Horizontal, Compact) */}
                  <Card className="border border-border/40 bg-card/45">
                    <CardContent className="p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-foreground">Profile Strength</span>
                        <span className="font-black text-primary">85% Complete</span>
                      </div>
                      
                      {/* Slim linear progress bar instead of giant circle */}
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-primary to-orange-500 h-full rounded-full" style={{ width: "85%" }} />
                      </div>
                      
                      <p className="text-[9px] text-muted-foreground leading-normal">
                        Add portfolio photos to reach 100% and unlock high-paying client leads.
                      </p>
                      
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setActiveTab("profile")}
                        className="w-full text-[10px] font-bold rounded-lg h-7.5 cursor-pointer mt-1"
                      >
                        Add Portfolio Items
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Widget: Refer & Earn Promo copier */}
                  <Card className="border border-border/40 bg-card/45">
                    <CardContent className="p-3.5 space-y-2.5">
                      <div className="text-[10px] font-bold text-foreground">Refer & Earn Link</div>
                      <p className="text-[9px] text-muted-foreground leading-normal">
                        Earn KES 100 instantly for every partner who signs up using your unique link.
                      </p>
                      
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="text"
                          readOnly
                          value={user ? `${window.location.origin}/auth/signup?ref=${user.id}` : ""}
                          className="flex-1 text-[9px] bg-muted/65 p-2 rounded-md border border-border/30 font-mono text-muted-foreground select-all outline-hidden min-w-0"
                        />
                        <Button
                          size="xs"
                          onClick={copyReferralLink}
                          className="h-7.5 rounded-md font-bold text-[9px] cursor-pointer px-2 flex-shrink-0"
                        >
                          {copiedReferral ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Widget: Professional Toolkits links */}
                  <Card className="border border-border/40 bg-card/45">
                    <CardContent className="p-0">
                      <div className="divide-y divide-border/25 text-[10px]">
                        <a href="#" className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors text-muted-foreground hover:text-foreground">
                          <span className="flex items-center gap-2 font-medium">
                            <Download className="h-3 w-3 text-primary" />
                            Invoice Template (PDF)
                          </span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                        <a href="#" className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors text-muted-foreground hover:text-foreground">
                          <span className="flex items-center gap-2 font-medium">
                            <HelpCircle className="h-3 w-3 text-primary" />
                            Tax Compliance Guide
                          </span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                        <a href="tel:+254799112919" className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors text-muted-foreground hover:text-foreground">
                          <span className="flex items-center gap-2 font-medium">
                            <Phone className="h-3 w-3 text-primary" />
                            24/7 Agent Support
                          </span>
                          <ChevronRight className="h-2.5 w-2.5" />
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
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4">
                <div>
                  <h1 className="text-lg font-extrabold text-foreground">Client Lead Matches</h1>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Review, apply, and contact clients looking for {profile?.trade || "General"} services.</p>
                </div>
                <div className="flex gap-1 bg-muted/40 p-1 rounded-lg border border-border/20 self-start sm:self-center">
                  <button className="px-2.5 py-1 rounded bg-card border border-border text-[9px] font-black uppercase text-primary">
                    Matching ({matchingLeads.length})
                  </button>
                  <button className="px-2.5 py-1 rounded text-muted-foreground hover:text-foreground text-[9px] font-bold uppercase cursor-pointer">
                    Applied (0)
                  </button>
                  <button className="px-2.5 py-1 rounded text-muted-foreground hover:text-foreground text-[9px] font-bold uppercase cursor-pointer">
                    Archived (0)
                  </button>
                </div>
              </div>

              {matchingLeads.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {matchingLeads.map((lead) => (
                    <Card key={lead.id} className="border-border bg-card hover:border-primary/45 transition-colors shadow-2xs flex flex-col justify-between overflow-hidden">
                      <div>
                        <CardHeader className="pb-2 bg-muted/15 border-b border-border/30 px-4 py-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[8px] font-black text-primary uppercase">
                                  {lead.trade}
                                </span>
                                <span className="text-[8px] text-muted-foreground flex items-center gap-0.5 font-semibold">
                                  <Clock className="h-2.5 w-2.5" /> {lead.createdAt}
                                </span>
                              </div>
                              <CardTitle className="text-xs font-black text-foreground mt-1.5 tracking-tight group-hover:text-primary transition-colors">
                                {lead.title}
                              </CardTitle>
                            </div>
                            <span className="text-[11px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2 py-0.5">
                              {lead.budget}
                            </span>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-4 space-y-3">
                          <p className="text-[11px] text-muted-foreground leading-normal">
                            {lead.description}
                          </p>

                          <div className="grid grid-cols-2 gap-2 pt-2 text-[9px] border-t border-border/20">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                              <span className="truncate">{lead.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3 text-primary flex-shrink-0" />
                              <span className="truncate">{lead.urgency}</span>
                            </div>
                          </div>
                        </CardContent>
                      </div>

                      <div className="p-4 bg-muted/10 border-t border-border/25 flex items-center justify-between gap-3">
                        <div className="text-[9px] text-muted-foreground">
                          Client: <span className="font-bold text-foreground">{lead.clientName}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <Button variant="outline" size="sm" asChild className="h-7.5 text-[10px] font-bold rounded-lg cursor-pointer px-2.5">
                            <a href={`tel:${lead.phone}`} className="flex items-center gap-1">
                              <Phone className="h-3 w-3" /> Call Client
                            </a>
                          </Button>
                          <Button size="sm" asChild className="h-7.5 text-[10px] font-bold rounded-lg cursor-pointer px-2.5">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${lead.clientName},%20I%2520saw%2520your%2520lead%2520on%2520FundiHub%2520for%2520'${encodeURIComponent(lead.title)}'%20and%2520I%2520am%2520available.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <MessageSquare className="h-3 w-3" /> WhatsApp
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-border bg-card/30 p-10 text-center shadow-2xs">
                  <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                  <h3 className="text-xs font-bold text-foreground">No matches at the moment</h3>
                  <p className="mt-1.5 text-[10px] text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    We match incoming projects based on your skill category ({profile?.trade || "General"}). Once a client submits a request, it will appear here.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* PROFILE & PORTFOLIO TAB CONTENT */}
          {activeTab === "profile" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="border-b border-border/40 pb-4">
                <h1 className="text-lg font-extrabold text-foreground">Profile & Works Portfolio</h1>
                <p className="text-[10px] text-muted-foreground mt-0.5">Configure your public identity cards and showcase photos of completed jobs to potential clients.</p>
              </div>

              <div className="grid gap-5 lg:grid-cols-5">
                
                {/* Form column */}
                <div className="lg:col-span-3 space-y-4">
                  <Card className="border border-border/40 bg-card">
                    <CardHeader className="py-4">
                      <CardTitle className="text-xs font-bold text-foreground">Professional Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <form onSubmit={handleUpdateProfile} className="space-y-3.5">
                        {updateSuccess && (
                          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-500 flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5" /> <span>{updateSuccess}</span>
                          </div>
                        )}

                        <div className="space-y-1">
                          <Label htmlFor="edit-name" className="text-[10px] font-bold text-foreground">Full Name</Label>
                          <Input
                            id="edit-name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full text-xs h-8.5 rounded-lg"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="edit-title" className="text-[10px] font-bold text-foreground">Professional Tagline / Title</Label>
                          <Input
                            id="edit-title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="e.g. Master Plumber & Piping Expert"
                            className="w-full text-xs h-8.5 rounded-lg"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="space-y-1">
                            <Label htmlFor="edit-trade" className="text-[10px] font-bold text-foreground">Primary Trade</Label>
                            <Input
                              id="edit-trade"
                              value={editTrade}
                              disabled
                              className="w-full text-xs h-8.5 rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="edit-exp" className="text-[10px] font-bold text-foreground">Experience (Years)</Label>
                            <Input
                              id="edit-exp"
                              value={editYearsExp}
                              onChange={(e) => setEditYearsExp(e.target.value)}
                              placeholder="e.g. 5 Years"
                              className="w-full text-xs h-8.5 rounded-lg"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="edit-area" className="text-[10px] font-bold text-foreground">Service Area Coverage</Label>
                          <Input
                            id="edit-area"
                            value={editArea}
                            onChange={(e) => setEditArea(e.target.value)}
                            placeholder="e.g. Nairobi, Kilimani & Westlands"
                            className="w-full text-xs h-8.5 rounded-lg"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="edit-desc" className="text-[10px] font-bold text-foreground">Professional Description / Bio</Label>
                          <textarea
                            id="edit-desc"
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            placeholder="Describe your expertise, typical jobs you take..."
                            className="flex min-h-20 w-full rounded-lg border border-input bg-transparent px-3 py-1.5 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/10"
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isUpdating}
                          className="w-full font-bold h-8.5 text-xs rounded-lg cursor-pointer mt-1"
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> Saving...
                            </>
                          ) : (
                            "Save Profile Details"
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Preview and Gallery column */}
                <div className="lg:col-span-2 space-y-4">
                  
                  {/* Public Card Preview */}
                  <Card className="border border-border/40 bg-gradient-to-b from-card to-muted/15 relative overflow-hidden">
                    <CardHeader className="py-3 border-b border-border/25">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-[10px] font-black tracking-wider uppercase text-foreground">Public Card Preview</CardTitle>
                        <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-black text-emerald-500 uppercase tracking-wide">
                          Active Search Listing
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-extrabold text-xs">
                          {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-extrabold text-xs text-foreground">{user?.name}</h4>
                            {profile?.premiumLevel !== "none" && (
                              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                            )}
                          </div>
                          <p className="text-[9px] text-muted-foreground font-semibold">{editTitle || `${editTrade} Specialist`}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold text-primary">
                          {editTrade}
                        </span>
                        <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5 text-primary" /> {editArea || "Nairobi"}
                        </span>
                        <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" /> {profile?.rating.toFixed(1)} ({profile?.reviews || 0} reviews)
                        </span>
                      </div>

                      <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed border-t border-border/20 pt-2">
                        {editDesc || "No description set yet. Write a professional description to describe your skills."}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Portfolio showcase photos */}
                  <Card className="border border-border/40 bg-card">
                    <CardHeader className="py-3 border-b border-border/25 flex flex-row items-center justify-between">
                      <CardTitle className="text-[10px] font-black tracking-wider uppercase text-foreground">Work Portfolio ({portfolioItems.length})</CardTitle>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => setIsAddPortfolioOpen(true)}
                        className="h-6.5 text-[9px] font-black rounded-md cursor-pointer"
                      >
                        + Add Photo
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-3">
                      {portfolioItems.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2.5">
                          {portfolioItems.map((item) => (
                            <div key={item.id} className="group relative rounded-lg overflow-hidden border border-border/30 bg-muted/20 aspect-video">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent p-2 flex flex-col justify-end">
                                <span className="text-[7px] font-black uppercase text-primary tracking-wider">{item.category}</span>
                                <h5 className="text-[9px] font-bold text-white truncate">{item.title}</h5>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4 bg-muted/15 rounded-lg border border-dashed border-border/40">
                          <ImageIcon className="h-5 w-5 text-muted-foreground mx-auto mb-1.5" />
                          <p className="text-[9px] text-muted-foreground">No portfolio photos uploaded.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                </div>

              </div>

              {/* Add Portfolio Dialog */}
              <Dialog open={isAddPortfolioOpen} onOpenChange={setIsAddPortfolioOpen}>
                <DialogContent className="border border-border bg-card p-4.5 rounded-lg shadow-lg w-full max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="text-xs font-bold text-foreground">Add Portfolio Work</DialogTitle>
                    <DialogDescription className="text-[10px] text-muted-foreground">Showcase pictures of jobs you did recently to attract clients.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddPortfolioItem} className="space-y-3.5 mt-1.5">
                    <div className="space-y-1">
                      <Label htmlFor="port-title" className="text-[10px] font-bold text-foreground">Project Title</Label>
                      <Input
                        id="port-title"
                        value={newPortfolioTitle}
                        onChange={(e) => setNewPortfolioTitle(e.target.value)}
                        placeholder="e.g. Master kitchen plumbing"
                        required
                        className="text-xs h-8.5 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="port-cat" className="text-[10px] font-bold text-foreground">Work Category</Label>
                      <select
                        id="port-cat"
                        value={newPortfolioCategory}
                        onChange={(e) => setNewPortfolioCategory(e.target.value)}
                        className="flex h-8.5 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-xs focus-visible:outline-hidden"
                      >
                        <option value="Wiring">Electrical Wiring</option>
                        <option value="Installation">Equipment Installation</option>
                        <option value="Repair">Trouble Repair</option>
                        <option value="Piping">Plumbing Piping</option>
                        <option value="General">Other Works</option>
                      </select>
                    </div>
                    
                    <div className="rounded-lg border border-dashed border-border/40 p-4 text-center bg-muted/15">
                      <ImageIcon className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-[9px] font-bold text-foreground">Select photos of your work</p>
                      <p className="text-[7px] text-muted-foreground mt-0.5">PNG, JPG up to 5MB (Simulated upload)</p>
                    </div>

                    <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-border/30">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsAddPortfolioOpen(false)}
                        className="text-xs h-8.5 px-3 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="text-xs h-8.5 px-3 rounded-lg font-bold cursor-pointer"
                      >
                        Save Work
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

            </div>
          )}

          {/* REFERRALS & REWARDS TAB CONTENT */}
          {activeTab === "referrals" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="border-b border-border/40 pb-4">
                <h1 className="text-lg font-extrabold text-foreground">Referrals & Rewards</h1>
                <p className="text-[10px] text-muted-foreground mt-0.5">Monitor your invite lists, copy registration links, and track your wallet payout statistics.</p>
              </div>

              {/* Stats overview cards row */}
              <div className="grid gap-4 grid-cols-3">
                <Card className="border border-border/40 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="p-3">
                    <div className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Total Referred</div>
                    <div className="text-base font-black text-foreground mt-1">{referralCount} Partners</div>
                  </CardContent>
                </Card>

                <Card className="border border-border/40 bg-gradient-to-br from-emerald-500/5 to-transparent">
                  <CardContent className="p-3">
                    <div className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Pending Payout</div>
                    <div className="text-base font-black text-foreground mt-1">
                      {user?.referrals?.filter((r: any) => r.status === "pending" || r.status === "registered").length || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border/40 bg-gradient-to-br from-blue-500/5 to-transparent">
                  <CardContent className="p-3">
                    <div className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Withdrawn Earnings</div>
                    <div className="text-base font-black text-foreground mt-1">KES {referralEarnings}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Refer link widgets grid */}
              <div className="grid gap-5 md:grid-cols-5">
                
                {/* Refer code card */}
                <div className="md:col-span-3 space-y-4">
                  <Card className="border border-border/40 bg-card">
                    <CardHeader className="py-3">
                      <CardTitle className="text-xs font-bold text-foreground">Your Referral Link</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          readOnly
                          value={user ? `${window.location.origin}/auth/signup?ref=${user.id}` : ""}
                          className="flex-grow text-[10px] bg-muted p-2 rounded-lg border border-border/30 font-mono text-muted-foreground outline-hidden select-all"
                        />
                        <Button
                          onClick={copyReferralLink}
                          className="h-8.5 px-3 rounded-lg font-bold text-xs cursor-pointer flex-shrink-0"
                        >
                          {copiedReferral ? "Copied!" : "Copy"}
                        </Button>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase mr-1">Quick Share:</span>
                        <Button size="xs" variant="outline" className="rounded-md h-6.5 text-[9px] font-bold cursor-pointer" asChild>
                          <a
                            href={`https://wa.me/?text=Hello!%20Join%20FundiHub%2520as%2520a%2520skilled%2520fundi%2520using%2520my%2520link%2520and%2520start%252520getting%252520direct%252520jobs:%20${encodeURIComponent(user ? `${window.location.origin}/auth/signup?ref=${user.id}` : "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        </Button>
                        <Button size="xs" variant="outline" className="rounded-md h-6.5 text-[9px] font-bold cursor-pointer" asChild>
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
                    <CardHeader className="py-3 border-b border-border/30">
                      <CardTitle className="text-xs font-bold text-foreground">Referral History Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {user?.referrals?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-[11px] border-collapse">
                            <thead>
                              <tr className="bg-muted/20 text-muted-foreground border-b border-border/35 font-bold">
                                <th className="p-2.5">Referee Name</th>
                                <th className="p-2.5">Trade</th>
                                <th className="p-2.5">Status</th>
                                <th className="p-2.5 text-right">Commission</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/25">
                              {user.referrals.map((ref: any) => (
                                <tr key={ref.id} className="hover:bg-muted/10">
                                  <td className="p-2.5 font-bold text-foreground">{ref.refereeName}</td>
                                  <td className="p-2.5 text-muted-foreground capitalize">{ref.refereeTrade}</td>
                                  <td className="p-2.5">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[8px] font-black uppercase ${
                                      ref.status === "paid"
                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/15"
                                        : ref.status === "registered"
                                        ? "bg-blue-500/10 text-blue-500 border border-blue-500/15"
                                        : "bg-amber-500/10 text-amber-500 border border-amber-500/15"
                                    }`}>
                                      {ref.status}
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-right font-black text-foreground">KES {ref.commission}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center p-6 text-muted-foreground space-y-1">
                          <Info className="h-5 w-5 text-muted-foreground mx-auto" />
                          <p className="text-[10px]">No referrals logged. Share your link to start earning!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Earnings Chart sidebar column */}
                <div className="md:col-span-2 space-y-4">
                  <Card className="border border-border/40 bg-card">
                    <CardHeader className="py-3 border-b border-border/30">
                      <CardTitle className="text-[9px] font-black tracking-wider uppercase text-foreground">Weekly Payout Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      
                      {/* Compact pure CSS Bar Chart */}
                      <div className="h-24 flex items-end justify-between gap-3 pt-1">
                        <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                          <div className="w-full bg-muted rounded-t-md h-[10%] relative group cursor-pointer hover:bg-primary/20 transition-colors">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-popover text-[7px] text-popover-foreground px-1 py-0.5 rounded-sm border border-border shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">KES 100</span>
                          </div>
                          <span className="text-[7px] text-muted-foreground font-bold">W1</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                          <div className="w-full bg-primary/40 rounded-t-md h-[40%] relative group cursor-pointer hover:bg-primary/60 transition-colors">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-popover text-[7px] text-popover-foreground px-1 py-0.5 rounded-sm border border-border shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">KES 400</span>
                          </div>
                          <span className="text-[7px] text-muted-foreground font-bold">W2</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                          <div className="w-full bg-primary/80 rounded-t-md h-[75%] relative group cursor-pointer hover:bg-primary transition-colors">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-popover text-[7px] text-popover-foreground px-1 py-0.5 rounded-sm border border-border shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">KES 750</span>
                          </div>
                          <span className="text-[7px] text-muted-foreground font-bold">W3</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                          <div className="w-full bg-primary rounded-t-md h-[95%] relative group cursor-pointer hover:bg-primary transition-colors">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-popover text-[7px] text-popover-foreground px-1 py-0.5 rounded-sm border border-border shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">KES 950</span>
                          </div>
                          <span className="text-[7px] text-muted-foreground font-bold">W4</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-border/25 text-[9px] text-muted-foreground leading-normal">
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
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="border-b border-border/40 pb-4">
                <h1 className="text-lg font-extrabold text-foreground">Membership & Boost Tiers</h1>
                <p className="text-[10px] text-muted-foreground mt-0.5">Upgrade your profile tier package to build massive customer trust and listing priority.</p>
              </div>

              {/* Pricing Cards Layout (Max-width container, more compact height) */}
              <div className="grid gap-5 md:grid-cols-2 max-w-2xl mx-auto pt-2">
                
                {/* Package: Verified Trust Tick */}
                <Card className={`border relative overflow-hidden transition-all duration-200 hover:shadow-md ${
                  profile?.premiumLevel === "verified"
                    ? "border-blue-500/50 bg-blue-500/5"
                    : "border-border bg-card"
                }`}>
                  <CardHeader className="text-center pb-3 pt-5 px-4">
                    <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 rounded-full px-2 py-0.5 mx-auto w-max mb-2.5">
                      Trust Tick
                    </span>
                    <CardTitle className="text-base font-black text-foreground">Verified Badge Tick</CardTitle>
                    <CardDescription className="text-[10px] mt-0.5">Get verified instantly and earn consumer trust</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4 px-4 pb-5">
                    <div className="space-y-0.5">
                      <span className="text-2xl font-black text-foreground">KES 300</span>
                      <span className="text-[10px] text-muted-foreground"> / month</span>
                    </div>

                    <div className="space-y-2 text-left text-[11px] text-muted-foreground max-w-[220px] mx-auto py-3.5 border-t border-b border-border/30">
                      <div className="flex gap-2">
                        <Check className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                        <span>Displays Blue Verified checkmark icon</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                        <span>30% boost in search clicks</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                        <span>Premium Client Support Access</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setPremiumModalType("verified")
                        setIsPremiumModalOpen(true)
                      }}
                      disabled={profile?.premiumLevel === "verified" || profile?.premiumLevel === "top"}
                      className="w-full rounded-lg font-bold cursor-pointer h-9 text-xs"
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
                  <div className="absolute top-0 right-0 bg-amber-500 text-white font-black text-[7px] uppercase tracking-wider px-2 py-0.5 rounded-bl-lg shadow-xs">
                    Popular
                  </div>
                  <CardHeader className="text-center pb-3 pt-5 px-4">
                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 rounded-full px-2 py-0.5 mx-auto w-max mb-2.5">
                      Elite Ranking
                    </span>
                    <CardTitle className="text-base font-black text-foreground">Top-Rank Verified Elite</CardTitle>
                    <CardDescription className="text-[10px] mt-0.5">Propel your account card to first row searches</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4 px-4 pb-5">
                    <div className="space-y-0.5">
                      <span className="text-2xl font-black text-foreground">KES 500</span>
                      <span className="text-[10px] text-muted-foreground"> / month</span>
                    </div>

                    <div className="space-y-2 text-left text-[11px] text-muted-foreground max-w-[220px] mx-auto py-3.5 border-t border-b border-border/30">
                      <div className="flex gap-2">
                        <Check className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                        <span>Verified Badge tick displays</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                        <span>Top row sorting priority</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                        <span>Up to 5x higher client leads</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setPremiumModalType("top")
                        setIsPremiumModalOpen(true)
                      }}
                      disabled={profile?.premiumLevel === "top"}
                      className="w-full rounded-lg font-bold cursor-pointer h-9 text-xs"
                    >
                      {profile?.premiumLevel === "top" ? "Tier Active" : "Upgrade to Top Partner"}
                    </Button>
                  </CardContent>
                </Card>

              </div>

            </div>
          )}

        </div>
      </main>

      {/* Premium Badge Checkout Dialog */}
      <Dialog open={isPremiumModalOpen} onOpenChange={setIsPremiumModalOpen}>
        <DialogContent className="border border-border bg-card p-4.5 rounded-lg shadow-lg w-full max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-xs font-bold text-foreground flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-primary animate-pulse" /> Activate Visibility Tier
            </DialogTitle>
            <DialogDescription className="text-[10px] text-muted-foreground">
              Boost your profile discovery rating and gain customer trust.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-3.5 border-t border-b border-border/30 my-2">
            <div className="rounded-lg bg-muted/40 border border-border/40 p-3 text-center space-y-1">
              <span className="text-[8px] font-black text-muted-foreground tracking-wider uppercase">
                {premiumModalType === "verified" ? "Verified Trust Tick" : "Top & Verified Tier"}
              </span>
              <div className="text-xl font-black text-primary">
                {premiumModalType === "verified" ? "Ksh 300 / mo" : "Ksh 500 / mo"}
              </div>
              <p className="text-[10px] text-muted-foreground leading-normal">
                {premiumModalType === "verified"
                  ? "Displays a verified trust tick icon on your profile search card, building immediate credibility."
                  : "Propels your profile listing to the top of category searches, giving you 5x more customer leads."}
              </p>
            </div>

            <div className="space-y-1.5 text-[9px] text-muted-foreground leading-normal bg-primary/5 rounded-lg p-2.5 border border-primary/10">
              <div className="flex gap-1.5">
                <Check className="h-3 w-3 text-primary flex-shrink-0" />
                <span>Immediate badge activation on profile search</span>
              </div>
              <div className="flex gap-1.5">
                <Check className="h-3 w-3 text-primary flex-shrink-0" />
                <span>Cancel or pause your subscription badge any time</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPremiumModalOpen(false)}
              className="text-xs h-8 px-3 rounded-lg cursor-pointer text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleActivateBadge}
              disabled={isProcessingPayment}
              className="text-xs h-8 px-3 rounded-lg font-bold cursor-pointer"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" /> Activating...
                </>
              ) : (
                "Pay & Activate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
