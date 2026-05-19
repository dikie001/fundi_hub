"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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
  Shield
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
    clientName: "Alice W.",
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
        // Not a fundi
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

  // Handle Badge Activation Mock Payment Flow
  const handleActivateBadge = async () => {
    setIsProcessingPayment(true)
    try {
      // Call PUT API to activate premium badge
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground gap-3.5">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          Loading your FundiHub Profile...
        </p>
      </div>
    )
  }

  // Filter mock incoming leads that match the active fundi's trade
  const matchingLeads = MOCK_CLIENT_LEADS.filter(
    (lead) => lead.trade.toLowerCase() === (profile?.trade || "").toLowerCase()
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Banner */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold text-primary tracking-tight">
                FundiHub
              </span>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary tracking-wide uppercase">
                Partner Panel
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden text-xs font-bold text-foreground md:inline">
                  {user?.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Habari, {user?.name || "Partner"}! 👋
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage your availability status, receive active incoming client job matches, and keep your verified profile updated.
            </p>
          </div>
          <div className="flex items-center gap-2.5 mt-2 md:mt-0">
            <span className="text-xs font-semibold text-muted-foreground">
              Availability:
            </span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
              profile?.isEmergency 
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                : "bg-muted text-muted-foreground border border-border"
            }`}>
              {profile?.isEmergency ? "Online & Open" : "Offline"}
            </span>
          </div>
        </div>

        {/* Hero Info Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Professional Details summary */}
          <Card className="border-border bg-card/60 shadow-xs relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-primary" /> Profile Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-foreground">
                  {profile?.rating.toFixed(1) || "5.0"}
                </span>
                <div className="flex text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Based on {profile?.reviews || 0} customer reviews
              </p>
              {profile?.premiumLevel !== "none" && (
                <div className="absolute top-2 right-2">
                  <ShieldCheck className="h-5 w-5 text-primary fill-primary/10" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Active Plan & Badge */}
          <Card className="border-border bg-card/60 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" /> Membership Tier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-foreground">
                  Monthly Partner
                </span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-500 uppercase tracking-wide">
                  Active
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-border/40">
                <span className={`rounded-sm px-1.5 py-0.5 text-[9px] font-bold border transition-colors ${
                  profile?.premiumLevel === "verified" || profile?.premiumLevel === "top"
                    ? "bg-blue-600/10 border-blue-600/20 text-blue-600"
                    : "bg-muted border-transparent text-muted-foreground cursor-pointer hover:bg-muted/80"
                }`}
                onClick={() => {
                  if (profile?.premiumLevel === "none") {
                    setPremiumModalType("verified")
                    setIsPremiumModalOpen(true)
                  }
                }}
                >
                  Verified ✓
                </span>
                <span className={`rounded-sm px-1.5 py-0.5 text-[9px] font-bold border transition-colors ${
                  profile?.premiumLevel === "top"
                    ? "bg-amber-600/10 border-amber-600/20 text-amber-600"
                    : "bg-muted border-transparent text-muted-foreground cursor-pointer hover:bg-muted/80"
                }`}
                onClick={() => {
                  if (profile?.premiumLevel !== "top") {
                    setPremiumModalType("top")
                    setIsPremiumModalOpen(true)
                  }
                }}
                >
                  Top ⭐
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Emergency controller */}
          <Card className={`border transition-all duration-300 shadow-xs ${
            profile?.isEmergency 
              ? "border-emerald-500/20 bg-emerald-500/5" 
              : "border-border bg-card/60"
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                <Zap className={`h-3.5 w-3.5 ${profile?.isEmergency ? "text-emerald-500 animate-pulse" : "text-primary"}`} /> On-Call Emergency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Available for urgent fixes
                </span>
                <div 
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                    profile?.isEmergency ? "bg-emerald-500" : "bg-muted border border-border"
                  }`}
                  onClick={() => handleToggleEmergency(profile?.isEmergency)}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow-xs transition-all ${
                    profile?.isEmergency ? "right-0.5" : "left-0.5"
                  }`} />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {profile?.isEmergency 
                  ? "You will appear as 'Immediate availability' on search listings." 
                  : "Toggle on to receive urgent, high-priority repair requests."}
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Referrals and commissions */}
          <Card className="border-border bg-card/60 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-primary" /> Invite Commission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold text-foreground">
                  KES 300
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground">
                  3 Invites
                </span>
              </div>
              <div className="mt-2.5 pt-1.5 border-t border-border/40 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground truncate max-w-28">
                  Get KES 100/signup
                </span>
                <Button
                  variant="ghost"
                  onClick={copyReferralLink}
                  className="h-6 gap-1 px-1.5 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  {copiedReferral ? (
                    <>
                      <Check className="h-3 w-3" /> Copied
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3 w-3" /> Copy Link
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workspace Layout */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Incoming Job Matches Inbox */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" /> Matching Client Leads
              </h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                {matchingLeads.length} Matches Found
              </span>
            </div>

            {matchingLeads.length > 0 ? (
              <div className="space-y-4">
                {matchingLeads.map((lead) => (
                  <Card key={lead.id} className="border-border/80 bg-card hover:border-primary/50 transition-colors shadow-sm overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/30 bg-muted/20">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase">
                              {lead.trade}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {lead.createdAt}
                            </span>
                          </div>
                          <CardTitle className="text-sm font-bold text-foreground mt-1.5">
                            {lead.title}
                          </CardTitle>
                        </div>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2 py-0.5">
                          {lead.budget}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-4">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {lead.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] border-t border-border/30">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          <span className="truncate">{lead.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          <span className="truncate">{lead.urgency}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="text-[10px] text-muted-foreground">
                          Client: <span className="font-bold text-foreground">{lead.clientName}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="xs" variant="outline" asChild className="h-8 text-[11px] font-medium rounded-lg">
                            <a href={`tel:${lead.phone}`} className="flex items-center gap-1">
                              <Phone className="h-3 w-3" /> Call
                            </a>
                          </Button>
                          <Button size="xs" asChild className="h-8 text-[11px] font-bold rounded-lg">
                            <a 
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${lead.clientName},%20I%20saw%20your%20lead%20on%20FundiHub%20for%20'${encodeURIComponent(lead.title)}'%20and%20I%20am%20available.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <MessageSquare className="h-3 w-3" /> WhatsApp
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

          {/* Profile Edit Panel */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Edit Partner Profile
            </h2>

            <Card className="border-border bg-card shadow-sm">
              <CardContent className="pt-5">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {updateSuccess && (
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-500 flex items-center gap-2 animate-in fade-in duration-200">
                      <Check className="h-4 w-4" /> <span>{updateSuccess}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-name" className="text-xs font-bold text-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. Calvince Wise"
                      className="w-full text-xs rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-title" className="text-xs font-bold text-foreground">
                      Professional Tagline / Title
                    </Label>
                    <Input
                      id="edit-title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="e.g. Master Plumber & Piping Expert"
                      className="w-full text-xs rounded-lg"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-trade" className="text-xs font-bold text-foreground">
                        Primary Trade
                      </Label>
                      <Input
                        id="edit-trade"
                        value={editTrade}
                        disabled
                        className="w-full text-xs rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-exp" className="text-xs font-bold text-foreground">
                        Experience (Years)
                      </Label>
                      <Input
                        id="edit-exp"
                        value={editYearsExp}
                        onChange={(e) => setEditYearsExp(e.target.value)}
                        placeholder="e.g. 5 Years"
                        className="w-full text-xs rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-area" className="text-xs font-bold text-foreground">
                      Service Area Coverage
                    </Label>
                    <Input
                      id="edit-area"
                      value={editArea}
                      onChange={(e) => setEditArea(e.target.value)}
                      placeholder="e.g. Nairobi, Kilimani & Westlands"
                      className="w-full text-xs rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-desc" className="text-xs font-bold text-foreground">
                      Professional Description / Bio
                    </Label>
                    <textarea
                      id="edit-desc"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="Describe your expertise, typical jobs you take, and service standards..."
                      className="flex min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-xs shadow-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full font-bold h-9.5 text-xs rounded-lg cursor-pointer"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Saving Changes...
                      </>
                    ) : (
                      "Save Profile Details"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Premium Badge Checkout Dialog */}
      <Dialog open={isPremiumModalOpen} onOpenChange={setIsPremiumModalOpen}>
        <DialogContent className="border border-border bg-card p-5 rounded-lg shadow-lg w-full max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-primary" /> Activate Premium Visibility
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Boost your profile discovery rating and gain customer trust.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 border-t border-b border-border/40 my-2">
            <div className="rounded-lg bg-muted/50 border border-border/60 p-3.5 text-center space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                {premiumModalType === "verified" ? "Verified Trust Badge" : "Top & Verified Status"}
              </span>
              <div className="text-2xl font-extrabold text-primary">
                {premiumModalType === "verified" ? "Ksh 300 / mo" : "Ksh 500 / mo"}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {premiumModalType === "verified"
                  ? "Displays a verified trust tick icon on your profile search card, building immediate credibility."
                  : "Propels your profile listing to the top of category searches, giving you 5x more customer leads."}
              </p>
            </div>

            <div className="space-y-2 text-[10px] text-muted-foreground leading-relaxed bg-primary/5 rounded-lg p-3 border border-primary/10">
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
