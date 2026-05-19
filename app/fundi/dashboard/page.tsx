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
    <div className="flex min-h-screen bg-[oklch(0.99_0.005_30)] dark:bg-[oklch(0.12_0.005_30)] transition-colors duration-300">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border/50 bg-card/60 backdrop-blur-xl">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* Logo brand */}
          <div className="flex items-center flex-shrink-0 px-6 gap-2">
            <span className="text-xl font-black bg-gradient-to-r from-[oklch(0.6_0.2_35)] to-[oklch(0.7_0.25_55)] bg-clip-text text-transparent tracking-tight">
              FundiHub
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-black text-primary tracking-widest uppercase">
              Pro
            </span>
          </div>

          {/* User info panel in sidebar */}
          <div className="mt-6 px-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 border border-border/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-500 text-white font-extrabold shadow-sm relative">
                {user?.name?.[0]?.toUpperCase() || "F"}
                {profile?.premiumLevel !== "none" && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] border border-white dark:border-zinc-900">
                    ✓
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{profile?.title || "Partner Partner"}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex-1 px-3 space-y-1">
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
                  className={`flex items-center justify-between w-full px-4 py-3 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="rounded-full bg-primary/20 text-primary px-1.5 py-0.5 text-[10px] font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="flex-shrink-0 flex border-t border-border/50 p-4 bg-muted/20">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-8 w-8 cursor-pointer"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  title="Toggle Mode"
                >
                  {resolvedTheme === "dark" ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-zinc-700" />}
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs font-bold text-muted-foreground hover:text-destructive gap-1.5 cursor-pointer rounded-xl"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER BAR */}
      <div className="md:hidden flex flex-col flex-1">
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 border-b border-border/50 bg-card/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-lg font-black bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              FundiHub
            </span>
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors"
              >
                {resolvedTheme === "dark" ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-zinc-700" />}
              </button>
            )}
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
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
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card border-r border-border">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-white bg-black/50 text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 gap-2">
                <span className="text-xl font-black text-primary">FundiHub</span>
                <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase">Partner</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
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
                      className={`group flex items-center justify-between w-full px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary/10 text-primary border-l-4 border-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4.5 w-4.5" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-3 rounded-full bg-primary/20 text-primary px-1.5 py-0.5 text-[9px] font-black">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="flex-shrink-0 flex border-t border-border p-4 bg-muted/10">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5" />
                Logout Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-grow md:pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* OVERVIEW TAB CONTENT */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
              
              {/* Header Greeting Glass Card */}
              <div className="relative rounded-3xl overflow-hidden border border-border bg-gradient-to-r from-orange-500/10 via-primary/5 to-transparent p-6 sm:p-8 shadow-sm">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                      Habari, {user?.name || "Partner"}! 👋
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
                      Welcome to your professional Partner Suite. You have <span className="font-bold text-primary">{matchingLeads.length} matching job opportunities</span> in your trade today.
                    </p>
                  </div>
                  
                  {/* Availability toggle component */}
                  <div className="flex items-center gap-3 bg-card/60 backdrop-blur-md rounded-2xl p-3 border border-border/80 shadow-xs self-start sm:self-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      On-Call Status
                    </span>
                    <button
                      onClick={() => handleToggleEmergency(profile?.isEmergency)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        profile?.isEmergency ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          profile?.isEmergency ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      profile?.isEmergency ? "text-emerald-500 animate-pulse" : "text-muted-foreground"
                    }`}>
                      {profile?.isEmergency ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistics/Metrics Cards Grid */}
              <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
                
                {/* Metric: Rating */}
                <Card className="border-border bg-card/50 backdrop-blur-xs relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-black text-muted-foreground tracking-wider uppercase flex items-center gap-2">
                      <Star className="h-3.5 w-3.5 text-primary fill-primary/10" />
                      Client Satisfaction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-foreground">{profile?.rating.toFixed(1) || "5.0"}</span>
                      <span className="text-xs text-muted-foreground">/ 5.0</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">({profile?.reviews || 0} reviews)</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Metric: Account Tier */}
                <Card className="border-border bg-card/50 backdrop-blur-xs relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-black text-muted-foreground tracking-wider uppercase flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                      Trust Badge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-foreground capitalize">
                        {profile?.premiumLevel === "none" ? "Standard Listing" : profile?.premiumLevel + " Partner"}
                      </span>
                    </div>
                    
                    {/* Badge Pill Indicators */}
                    <div className="flex gap-1 mt-2.5">
                      <span className={`rounded-sm px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider border ${
                        profile?.premiumLevel === "verified" || profile?.premiumLevel === "top"
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                          : "bg-muted text-muted-foreground border-transparent cursor-pointer hover:bg-muted/80"
                      }`}
                      onClick={() => {
                        if (profile?.premiumLevel === "none") {
                          setPremiumModalType("verified")
                          setIsPremiumModalOpen(true)
                        }
                      }}
                      >
                        Verified
                      </span>
                      <span className={`rounded-sm px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider border ${
                        profile?.premiumLevel === "top"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                          : "bg-muted text-muted-foreground border-transparent cursor-pointer hover:bg-muted/80"
                      }`}
                      onClick={() => {
                        if (profile?.premiumLevel !== "top") {
                          setPremiumModalType("top")
                          setIsPremiumModalOpen(true)
                        }
                      }}
                      >
                        Top Ranked
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Metric: Completed Jobs */}
                <Card className="border-border bg-card/50 backdrop-blur-xs relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-black text-muted-foreground tracking-wider uppercase flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5 text-primary" />
                      Jobs Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-foreground">24</span>
                      <span className="text-xs text-muted-foreground text-emerald-500 font-bold">+3 this week</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                      98% success rating on jobs taken
                    </p>
                  </CardContent>
                </Card>

                {/* Metric: Total Earnings */}
                <Card className="border-border bg-card/50 backdrop-blur-xs relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-black text-muted-foreground tracking-wider uppercase flex items-center gap-2">
                      <DollarSign className="h-3.5 w-3.5 text-primary" />
                      Total Payouts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-foreground">KES {totalEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2">
                      <span>Ref: KES {referralEarnings}</span>
                      <span>Jobs: KES {jobEarnings}</span>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Workspace Layout Grid */}
              <div className="grid gap-6 lg:grid-cols-5">
                
                {/* Recommended leads card list */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black text-foreground tracking-tight uppercase flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-primary" />
                      Client Job Matches ({matchingLeads.length})
                    </h2>
                    <button
                      onClick={() => setActiveTab("leads")}
                      className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View All Inbox <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>

                  {matchingLeads.length > 0 ? (
                    <div className="space-y-4">
                      {matchingLeads.slice(0, 2).map((lead) => (
                        <Card key={lead.id} className="border-border bg-card hover:border-primary/40 transition-all duration-300 shadow-xs hover:shadow-md group overflow-hidden">
                          <CardHeader className="pb-3 bg-muted/15 border-b border-border/30 px-5 py-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[9px] font-black text-primary uppercase">
                                    {lead.trade}
                                  </span>
                                  <span className="text-[9px] text-muted-foreground flex items-center gap-1 font-semibold">
                                    <Clock className="h-3 w-3" /> {lead.createdAt}
                                  </span>
                                </div>
                                <CardTitle className="text-sm font-bold text-foreground mt-2 tracking-tight group-hover:text-primary transition-colors">
                                  {lead.title}
                                </CardTitle>
                              </div>
                              <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-0.5">
                                {lead.budget}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="p-5 space-y-4">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {lead.description}
                            </p>

                            <div className="grid grid-cols-2 gap-3 pt-3 text-[10px] border-t border-border/30">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                <span className="truncate font-semibold">{lead.location}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                <span className="truncate font-semibold">{lead.urgency}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1 gap-4">
                              <div className="text-[10px] text-muted-foreground">
                                Client: <span className="font-extrabold text-foreground">{lead.clientName}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button size="xs" variant="outline" asChild className="h-8 text-[10px] font-bold rounded-lg cursor-pointer">
                                  <a href={`tel:${lead.phone}`} className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" /> Call
                                  </a>
                                </Button>
                                <Button size="xs" asChild className="h-8 text-[10px] font-bold rounded-lg cursor-pointer">
                                  <a
                                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${lead.clientName},%20I%20saw%20your%20lead%20on%20FundiHub%20for%20'${encodeURIComponent(lead.title)}'%20and%20I%20am%20available.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1"
                                  >
                                    <MessageSquare className="h-3 w-3" /> Message
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-border bg-card/40 p-8 text-center shadow-xs">
                      <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                      <h3 className="text-sm font-bold text-foreground">No matches at the moment</h3>
                      <p className="mt-1.5 text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        We match incoming projects based on your exact skill category ({profile?.trade || "General"}). Once a client submits a matching request, it will appear here instantly.
                      </p>
                    </Card>
                  )}
                </div>

                {/* Right side widgets layout */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Widget: Profile Completeness Gauge */}
                  <Card className="border border-border/60 bg-card/60">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xs font-black tracking-wider uppercase text-foreground">
                        Profile Completeness
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center">
                          {/* Circular progress bar SVG */}
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-muted" fill="transparent" />
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-primary" fill="transparent"
                              strokeDasharray={175.9}
                              strokeDashoffset={175.9 * (1 - 0.85)}
                            />
                          </svg>
                          <span className="absolute text-xs font-black text-foreground">85%</span>
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs font-bold text-foreground">Excellent Profile Strength</p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            Upload 2 more portfolio pictures of previous jobs to reach 100% and unlock high-paying client leads.
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("profile")}
                        className="w-full text-xs font-bold gap-1 rounded-xl h-8.5 cursor-pointer"
                      >
                        Add Portfolio Items
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Widget: Refer & Earn Promo copier */}
                  <Card className="border border-border/60 bg-card/60">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xs font-black tracking-wider uppercase text-foreground">
                        Refer & Earn Program
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Earn KES 100 instantly for every fellow Fundi who signs up and upgrades using your unique referral code.
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={user ? `${window.location.origin}/auth/signup?ref=${user.id}` : ""}
                          className="flex-1 text-[10px] bg-muted/60 p-2.5 rounded-lg border border-border/40 font-mono text-muted-foreground select-all outline-hidden"
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

                  {/* Widget: Professional Toolkits links */}
                  <Card className="border border-border/60 bg-card/60">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xs font-black tracking-wider uppercase text-foreground">
                        Professional Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border/40 text-[11px]">
                        <a href="#" className="flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground">
                          <span className="flex items-center gap-2 font-semibold">
                            <Download className="h-3.5 w-3.5 text-primary" />
                            FundiHub Invoice Template (PDF)
                          </span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <a href="#" className="flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground">
                          <span className="flex items-center gap-2 font-semibold">
                            <HelpCircle className="h-3.5 w-3.5 text-primary" />
                            Tax Compliance & Registration Guide
                          </span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <a href="tel:+254799112919" className="flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground">
                          <span className="flex items-center gap-2 font-semibold">
                            <Phone className="h-3.5 w-3.5 text-primary" />
                            24/7 Agent Support Hotline
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
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Client Lead Matches</h1>
                  <p className="text-xs text-muted-foreground mt-1">Review, apply, and contact clients looking for {profile?.trade || "General"} services.</p>
                </div>
                <div className="flex gap-1.5 self-start mt-3 sm:mt-0 bg-muted/40 p-1 rounded-xl border border-border/20">
                  <button className="px-3 py-1.5 rounded-lg bg-card border border-border text-[10px] font-black uppercase text-primary">
                    Matching ({matchingLeads.length})
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase cursor-pointer">
                    Applied (0)
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase cursor-pointer">
                    Archived (0)
                  </button>
                </div>
              </div>

              {matchingLeads.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {matchingLeads.map((lead) => (
                    <Card key={lead.id} className="border-border bg-card hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md group flex flex-col justify-between overflow-hidden">
                      <div>
                        <CardHeader className="pb-3 bg-muted/15 border-b border-border/30 px-5 py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="rounded bg-primary/10 px-2 py-0.5 text-[9px] font-black text-primary uppercase">
                                  {lead.trade}
                                </span>
                                <span className="text-[9px] text-muted-foreground flex items-center gap-1 font-semibold">
                                  <Clock className="h-3 w-3" /> {lead.createdAt}
                                </span>
                              </div>
                              <CardTitle className="text-sm font-black text-foreground mt-2 tracking-tight group-hover:text-primary transition-colors">
                                {lead.title}
                              </CardTitle>
                            </div>
                            <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1">
                              {lead.budget}
                            </span>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-5 space-y-4">
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {lead.description}
                          </p>

                          <div className="grid grid-cols-2 gap-3 pt-3 text-[10px] border-t border-border/30">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                              <span className="truncate font-semibold">{lead.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                              <span className="truncate font-semibold">{lead.urgency}</span>
                            </div>
                          </div>
                        </CardContent>
                      </div>

                      <div className="p-5 bg-muted/10 border-t border-border/40 flex items-center justify-between gap-4">
                        <div className="text-[10px] text-muted-foreground">
                          Client: <span className="font-extrabold text-foreground">{lead.clientName}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild className="h-8.5 text-xs font-bold rounded-lg cursor-pointer px-3">
                            <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5" /> Call Client
                            </a>
                          </Button>
                          <Button size="sm" asChild className="h-8.5 text-xs font-bold rounded-lg cursor-pointer px-3">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${lead.clientName},%20I%20saw%20your%20lead%20on%20FundiHub%20for%20'${encodeURIComponent(lead.title)}'%20and%20I%20am%20available.`}
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
                <Card className="border-border bg-card/30 p-12 text-center shadow-xs">
                  <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-base font-bold text-foreground">No matches at the moment</h3>
                  <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                    We match incoming projects based on your exact skill category ({profile?.trade || "General"}). Once a client submits a matching request, it will appear here instantly.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* PROFILE & PORTFOLIO TAB CONTENT */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              
              <div className="border-b border-border/60 pb-5">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Profile & Works Portfolio</h1>
                <p className="text-xs text-muted-foreground mt-1">Configure your public identity cards and showcase photos of completed jobs to potential clients.</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-5">
                
                {/* Form column */}
                <div className="lg:col-span-3 space-y-6">
                  <Card className="border border-border/60 bg-card">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold text-foreground">Professional Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        {updateSuccess && (
                          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-500 flex items-center gap-2 animate-in fade-in duration-200">
                            <Check className="h-4 w-4" /> <span>{updateSuccess}</span>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-name" className="text-xs font-bold text-foreground">Full Name</Label>
                          <Input
                            id="edit-name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full text-xs rounded-xl"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-title" className="text-xs font-bold text-foreground">Professional Tagline / Title</Label>
                          <Input
                            id="edit-title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="e.g. Master Plumber & Piping Expert"
                            className="w-full text-xs rounded-xl"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-trade" className="text-xs font-bold text-foreground">Primary Trade</Label>
                            <Input
                              id="edit-trade"
                              value={editTrade}
                              disabled
                              className="w-full text-xs rounded-xl bg-muted text-muted-foreground cursor-not-allowed"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-exp" className="text-xs font-bold text-foreground">Experience (Years)</Label>
                            <Input
                              id="edit-exp"
                              value={editYearsExp}
                              onChange={(e) => setEditYearsExp(e.target.value)}
                              placeholder="e.g. 5 Years"
                              className="w-full text-xs rounded-xl"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-area" className="text-xs font-bold text-foreground">Service Area Coverage</Label>
                          <Input
                            id="edit-area"
                            value={editArea}
                            onChange={(e) => setEditArea(e.target.value)}
                            placeholder="e.g. Nairobi, Kilimani & Westlands"
                            className="w-full text-xs rounded-xl"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-desc" className="text-xs font-bold text-foreground">Professional Description / Bio</Label>
                          <textarea
                            id="edit-desc"
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            placeholder="Describe your expertise, typical jobs you take, and service standards..."
                            className="flex min-h-28 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-xs shadow-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/20"
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isUpdating}
                          className="w-full font-bold h-10 text-xs rounded-xl cursor-pointer"
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Saving Details...
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
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Public Card Preview */}
                  <Card className="border border-border/60 bg-gradient-to-b from-card to-muted/20 relative overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/30">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-black tracking-wider uppercase text-foreground">Public Card Preview</CardTitle>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8px] font-black text-emerald-500 uppercase tracking-wider">
                          Active Search Listing
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-extrabold text-lg">
                          {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-sm text-foreground">{user?.name}</h4>
                            {profile?.premiumLevel !== "none" && (
                              <ShieldCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground font-semibold">{editTitle || `${editTrade} Specialist`}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                          {editTrade}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary" /> {editArea || "Nairobi"}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {profile?.rating.toFixed(1)} ({profile?.reviews || 0} reviews)
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed border-t border-border/30 pt-2">
                        {editDesc || "No description set yet. Write a professional description to describe your skills."}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Portfolio showcase photos */}
                  <Card className="border border-border/60 bg-card">
                    <CardHeader className="pb-3 border-b border-border/30 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-black tracking-wider uppercase text-foreground">Work Portfolio ({portfolioItems.length})</CardTitle>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => setIsAddPortfolioOpen(true)}
                        className="h-7 text-[10px] font-black rounded-lg cursor-pointer"
                      >
                        + Add Work
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {portfolioItems.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {portfolioItems.map((item) => (
                            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-border/50 bg-muted/30 aspect-square">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-end">
                                <span className="text-[8px] font-black uppercase text-primary tracking-wider">{item.category}</span>
                                <h5 className="text-[10px] font-bold text-white truncate">{item.title}</h5>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-6 bg-muted/20 rounded-xl border border-dashed border-border">
                          <ImageIcon className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                          <p className="text-[10px] text-muted-foreground">No portfolio photos. Add photos to get noticed 3x faster.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                </div>

              </div>

              {/* Add Portfolio Dialog */}
              <Dialog open={isAddPortfolioOpen} onOpenChange={setIsAddPortfolioOpen}>
                <DialogContent className="border border-border bg-card p-5 rounded-xl shadow-lg w-full max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="text-sm font-bold text-foreground">Add Portfolio Work</DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">Showcase pictures of jobs you did recently to attract clients.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddPortfolioItem} className="space-y-4 mt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="port-title" className="text-xs font-bold text-foreground">Project Title</Label>
                      <Input
                        id="port-title"
                        value={newPortfolioTitle}
                        onChange={(e) => setNewPortfolioTitle(e.target.value)}
                        placeholder="e.g. Master kitchen wiring repair"
                        required
                        className="text-xs rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="port-cat" className="text-xs font-bold text-foreground">Work Category</Label>
                      <select
                        id="port-cat"
                        value={newPortfolioCategory}
                        onChange={(e) => setNewPortfolioCategory(e.target.value)}
                        className="flex h-9.5 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-hidden"
                      >
                        <option value="Wiring">Electrical Wiring</option>
                        <option value="Installation">Equipment Installation</option>
                        <option value="Repair">Trouble Repair</option>
                        <option value="Piping">Plumbing Piping</option>
                        <option value="General">Other Works</option>
                      </select>
                    </div>
                    
                    {/* Simulated file upload block */}
                    <div className="rounded-xl border border-dashed border-border p-5 text-center bg-muted/20">
                      <ImageIcon className="h-6 w-6 text-primary mx-auto mb-1.5" />
                      <p className="text-[10px] font-bold text-foreground">Select photos of your work</p>
                      <p className="text-[8px] text-muted-foreground mt-0.5">PNG, JPG up to 5MB (Simulated upload)</p>
                    </div>

                    <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-border/30">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsAddPortfolioOpen(false)}
                        className="text-xs h-9 px-4 rounded-xl cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="text-xs h-9 px-4 rounded-xl font-bold cursor-pointer"
                      >
                        Save Portfolio Work
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

            </div>
          )}

          {/* REFERRALS & REWARDS TAB CONTENT */}
          {activeTab === "referrals" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              
              <div className="border-b border-border/60 pb-5">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans">Referrals & Rewards</h1>
                <p className="text-xs text-muted-foreground mt-1">Monitor your invite lists, copy registration links, and track your wallet payout statistics.</p>
              </div>

              {/* Stats overview cards row */}
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
                <Card className="border border-border/60 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader className="pb-1.5">
                    <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Total referred partners</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-foreground">{referralCount} Fundis</div>
                    <p className="text-[10px] text-muted-foreground mt-1">Successfully signed up</p>
                  </CardContent>
                </Card>

                <Card className="border border-border/60 bg-gradient-to-br from-emerald-500/5 to-transparent">
                  <CardHeader className="pb-1.5">
                    <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Pending Activation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-foreground">
                      {user?.referrals?.filter((r: any) => r.status === "pending" || r.status === "registered").length || 0}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Awaiting registration payment</p>
                  </CardContent>
                </Card>

                <Card className="border border-border/60 bg-gradient-to-br from-blue-500/5 to-transparent">
                  <CardHeader className="pb-1.5">
                    <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Withdrawn Rewards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-foreground">KES {referralEarnings}</div>
                    <p className="text-[10px] text-muted-foreground mt-1">Payout directly to MPesa</p>
                  </CardContent>
                </Card>
              </div>

              {/* Refer link widgets grid */}
              <div className="grid gap-6 md:grid-cols-5">
                
                {/* Refer code card */}
                <div className="md:col-span-3 space-y-6">
                  <Card className="border border-border/60 bg-card">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold text-foreground">Your Invitation link</CardTitle>
                      <CardDescription className="text-xs">Share your referral link on social media networks to easily invite colleagues.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="text"
                          readOnly
                          value={user ? `${window.location.origin}/auth/signup?ref=${user.id}` : ""}
                          className="flex-grow text-xs bg-muted p-3 rounded-xl border border-border/60 font-mono text-muted-foreground outline-hidden select-all"
                        />
                        <Button
                          onClick={copyReferralLink}
                          className="h-10 px-4 rounded-xl font-bold text-xs cursor-pointer flex-shrink-0"
                        >
                          {copiedReferral ? "Copied!" : "Copy Link"}
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase mr-2">Quick Share:</span>
                        <Button size="xs" variant="outline" className="rounded-lg h-7 text-[10px] font-bold cursor-pointer" asChild>
                          <a
                            href={`https://wa.me/?text=Hello!%20Join%20FundiHub%20as%2520a%20skilled%20fundi%20using%20my%20link%20and%20start%20getting%20direct%20jobs:%20${encodeURIComponent(user ? `${window.location.origin}/auth/signup?ref=${user.id}` : "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        </Button>
                        <Button size="xs" variant="outline" className="rounded-lg h-7 text-[10px] font-bold cursor-pointer" asChild>
                          <a
                            href={`https://twitter.com/intent/tweet?text=Highly%20recommend%20registering%20on%20FundiHub%20to%20get%20client%20job%20leads%20near%20you.%20Signup%20link:%20${encodeURIComponent(user ? `${window.location.origin}/auth/signup?ref=${user.id}` : "")}`}
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
                  <Card className="border border-border/60 bg-card overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/30">
                      <CardTitle className="text-sm font-bold text-foreground">Referral Activity History</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {user?.referrals?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-muted/30 text-muted-foreground border-b border-border/40 font-bold">
                                <th className="p-3.5">Referee Name</th>
                                <th className="p-3.5">Trade Category</th>
                                <th className="p-3.5">Registration Status</th>
                                <th className="p-3.5 text-right">Commission</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                              {user.referrals.map((ref: any) => (
                                <tr key={ref.id} className="hover:bg-muted/10">
                                  <td className="p-3.5 font-bold text-foreground">{ref.refereeName}</td>
                                  <td className="p-3.5 text-muted-foreground capitalize">{ref.refereeTrade}</td>
                                  <td className="p-3.5">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                                      ref.status === "paid"
                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                        : ref.status === "registered"
                                        ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
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
                          <p className="text-xs">No referral activities logged. Share your invite link to start earning!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Earnings Chart sidebar column */}
                <div className="md:col-span-2 space-y-6">
                  <Card className="border border-border/60 bg-card">
                    <CardHeader className="pb-3 border-b border-border/30">
                      <CardTitle className="text-xs font-black tracking-wider uppercase text-foreground">Weekly Payout analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-6">
                      
                      {/* Elegant pure CSS Bar Chart */}
                      <div className="h-32 flex items-end justify-between gap-3 pt-2">
                        <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div className="w-full bg-muted rounded-t-md h-[10%] relative group cursor-pointer hover:bg-primary/20 transition-colors">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-popover text-[8px] text-popover-foreground px-1 py-0.5 rounded-sm border border-border shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">KES 100</span>
                          </div>
                          <span className="text-[8px] text-muted-foreground font-bold">W1</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div className="w-full bg-primary/40 rounded-t-md h-[40%] relative group cursor-pointer hover:bg-primary/60 transition-colors">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-popover text-[8px] text-popover-foreground px-1 py-0.5 rounded-sm border border-border shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">KES 400</span>
                          </div>
                          <span className="text-[8px] text-muted-foreground font-bold">W2</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div className="w-full bg-primary/80 rounded-t-md h-[75%] relative group cursor-pointer hover:bg-primary transition-colors">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-popover text-[8px] text-popover-foreground px-1 py-0.5 rounded-sm border border-border shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">KES 750</span>
                          </div>
                          <span className="text-[8px] text-muted-foreground font-bold">W3</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div className="w-full bg-primary rounded-t-md h-[95%] relative group cursor-pointer hover:bg-primary transition-colors">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-popover text-[8px] text-popover-foreground px-1 py-0.5 rounded-sm border border-border shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">KES 950</span>
                          </div>
                          <span className="text-[8px] text-muted-foreground font-bold">W4</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-border/40 text-[10px] text-muted-foreground leading-relaxed">
                        <div className="flex items-center justify-between font-bold text-foreground">
                          <span>Active Promotion Rate:</span>
                          <span className="text-primary">KES 100 per sign-up</span>
                        </div>
                        <p>Referral payouts are calculated weekly and transfer automatically to your registered MPesa mobile number on Friday mornings.</p>
                      </div>

                    </CardContent>
                  </Card>
                </div>

              </div>

            </div>
          )}

          {/* MEMBERSHIP BENEFITS TAB CONTENT */}
          {activeTab === "membership" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
              
              <div className="border-b border-border/60 pb-5">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Membership & Boost Tiers</h1>
                <p className="text-xs text-muted-foreground mt-1">Upgrade your profile tier package to build massive customer trust and listing priority.</p>
              </div>

              {/* Pricing Cards Layout grid */}
              <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto pt-4">
                
                {/* Package: Verified Trust Tick */}
                <Card className={`border relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                  profile?.premiumLevel === "verified"
                    ? "border-blue-500/50 bg-blue-500/5"
                    : "border-border bg-card"
                }`}>
                  <CardHeader className="text-center pb-4 pt-6">
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 rounded-full px-3 py-1 mx-auto w-max mb-3">
                      Trust Package
                    </span>
                    <CardTitle className="text-lg font-black text-foreground">Verified Badge Tick</CardTitle>
                    <CardDescription className="text-xs mt-1">Get verified instantly and earn consumer trust</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-6">
                    <div className="space-y-1">
                      <span className="text-3xl font-black text-foreground">KES 300</span>
                      <span className="text-xs text-muted-foreground"> / month</span>
                    </div>

                    <div className="space-y-2.5 text-left text-xs text-muted-foreground max-w-[240px] mx-auto py-4 border-t border-b border-border/30">
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span>Displays Blue Verified checkmark next to your name</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span>30% boost in client search card clicks</span>
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
                      className="w-full rounded-xl font-bold cursor-pointer py-5 text-xs"
                    >
                      {profile?.premiumLevel === "verified" || profile?.premiumLevel === "top" ? "Tier Active" : "Activate Verified Tick"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Package: Top Ranked visibility */}
                <Card className={`border relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                  profile?.premiumLevel === "top"
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-border bg-card"
                }`}>
                  <div className="absolute top-0 right-0 bg-amber-500 text-white font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-xs">
                    Popular
                  </div>
                  <CardHeader className="text-center pb-4 pt-6">
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 rounded-full px-3 py-1 mx-auto w-max mb-3">
                      Visibility Package
                    </span>
                    <CardTitle className="text-lg font-black text-foreground">Top-Rank Verified Elite</CardTitle>
                    <CardDescription className="text-xs mt-1">Propel your account card to first row category results</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-6">
                    <div className="space-y-1">
                      <span className="text-3xl font-black text-foreground">KES 500</span>
                      <span className="text-xs text-muted-foreground"> / month</span>
                    </div>

                    <div className="space-y-2.5 text-left text-xs text-muted-foreground max-w-[240px] mx-auto py-4 border-t border-b border-border/30">
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <span>Showcases Verified Badge tick on card</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <span>Top row sorting layout priority</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <span>Up to 5x higher client lead inquiries</span>
                      </div>
                      <div className="flex gap-2">
                        <Check className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <span>Unlimited emergency matching options</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setPremiumModalType("top")
                        setIsPremiumModalOpen(true)
                      }}
                      disabled={profile?.premiumLevel === "top"}
                      className="w-full rounded-xl font-bold cursor-pointer py-5 text-xs"
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
        <DialogContent className="border border-border bg-card p-5 rounded-xl shadow-lg w-full max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-primary" /> Activate Premium Visibility
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Boost your profile discovery rating and gain customer trust.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 border-t border-b border-border/40 my-2">
            <div className="rounded-xl bg-muted/50 border border-border/60 p-3.5 text-center space-y-1.5">
              <span className="text-[9px] font-black text-muted-foreground tracking-wider uppercase">
                {premiumModalType === "verified" ? "Verified Trust Badge" : "Top & Verified Status"}
              </span>
              <div className="text-2xl font-black text-primary">
                {premiumModalType === "verified" ? "Ksh 300 / mo" : "Ksh 500 / mo"}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {premiumModalType === "verified"
                  ? "Displays a verified trust tick icon on your profile search card, building immediate credibility."
                  : "Propels your profile listing to the top of category searches, giving you 5x more customer leads."}
              </p>
            </div>

            <div className="space-y-2 text-[10px] text-muted-foreground leading-relaxed bg-primary/5 rounded-xl p-3 border border-primary/10">
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
              className="text-xs h-9.5 px-4 rounded-xl cursor-pointer text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleActivateBadge}
              disabled={isProcessingPayment}
              className="text-xs h-9.5 px-4 rounded-xl font-bold cursor-pointer"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" /> Activating...
                </>
              ) : (
                "Pay and Activate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
