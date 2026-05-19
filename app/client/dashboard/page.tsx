"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Wrench,
  Star,
  Check,
  Loader2,
  LogOut,
  MessageSquare,
  Phone,
  User,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  TrendingUp,
  Inbox
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const TRADES_LIST = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Painter",
  "Mason",
  "Welder",
  "Appliance Repair",
  "HVAC Tech",
  "Cleaner",
  "Gardener"
]

export default function ClientDashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [allFundis, setAllFundis] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState("")

  // Edit fields states
  const [editName, setEditName] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editLocation, setEditLocation] = useState("")
  const [editBudget, setEditBudget] = useState("")
  const [editUrgency, setEditUrgency] = useState("")

  // Fetch logged in profile and all fundis
  const fetchData = async () => {
    try {
      const meResponse = await fetch("/api/auth/me")
      if (!meResponse.ok) {
        window.location.href = "/auth/login"
        return
      }
      const meData = await meResponse.json()
      if (meData.user && meData.user.role === "client") {
        setUser(meData.user)
        setProfile(meData.user.clientProfile)
        setEditName(meData.user.name || "")
        setEditCategory(meData.user.clientProfile?.projectCategory || "")
        setEditLocation(meData.user.clientProfile?.projectLocation || "")
        setEditBudget(meData.user.clientProfile?.budgetRange || "")
        setEditUrgency(meData.user.clientProfile?.urgency || "")
      } else {
        // Not a client
        window.location.href = "/"
        return
      }

      // Fetch active fundi directory from DB
      const fundisResponse = await fetch("/api/fundis")
      if (fundisResponse.ok) {
        const fundisData = await fundisResponse.json()
        setAllFundis(fundisData)
      }
    } catch (error) {
      console.error("Error loading client dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle Client Requirements Update
  const handleUpdateRequirements = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateSuccess("")

    try {
      const response = await fetch("/api/client/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          projectCategory: editCategory,
          projectLocation: editLocation,
          budgetRange: editBudget,
          urgency: editUrgency,
        })
      })

      if (response.ok) {
        setUpdateSuccess("Project listing updated successfully!")
        fetchData()
        setTimeout(() => setUpdateSuccess(""), 4000)
      } else {
        const data = await response.json()
        alert(data.error || "Failed to save project requirements.")
      }
    } catch (error) {
      console.error("Error updating requirements:", error)
    } finally {
      setIsUpdating(false)
    }
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
          Loading your Client Workspace...
        </p>
      </div>
    )
  }

  // Filter fundis who match the client's current project category
  const activeCategory = profile?.projectCategory || ""
  const matchedFundis = allFundis.filter(
    (fundi) => 
      activeCategory && 
      (fundi.trade || "").toLowerCase() === activeCategory.toLowerCase()
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold text-primary tracking-tight">
                FundiHub
              </span>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary tracking-wide uppercase">
                Client Workspace
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

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Banner */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Habari, {user?.name || "Client"}! 👋
            </h1>
            <p className="text-xs text-muted-foreground">
              Define your service requirements, view direct matches from verified expert partners, and connect instantly.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Button size="xs" variant="outline" asChild className="h-8 text-[11px] font-bold rounded-lg">
              <Link href="/">Browse All Categories</Link>
            </Button>
          </div>
        </div>

        {/* Dynamic Summary Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card/60 shadow-xs relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-primary" /> Project Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-extrabold text-foreground truncate">
                {profile?.projectCategory || "Not Defined"}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Current service expert match type
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/60 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Project Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-extrabold text-foreground truncate">
                {profile?.projectLocation || "Not Defined"}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Repair/project location coverage
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/60 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-primary" /> Target Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-extrabold text-foreground truncate">
                {profile?.budgetRange || "Not Defined"}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Pre-defined target price range
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/60 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" /> Match Urgency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-extrabold text-foreground truncate">
                {profile?.urgency || "Not Defined"}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Required completion window
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Workspace Splitting Layout */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Matched Fundis Inbox Panel */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" /> Matched Verified Experts
              </h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                {matchedFundis.length} Experts Online
              </span>
            </div>

            {matchedFundis.length > 0 ? (
              <div className="space-y-4">
                {matchedFundis.map((fundi) => (
                  <Card key={fundi.id} className="border-border/80 bg-card hover:border-primary/50 transition-colors shadow-sm overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/30 bg-muted/20">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm uppercase">
                            {fundi.user?.name?.slice(0, 2) || "EX"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-foreground">
                                {fundi.user?.name}
                              </span>
                              {(fundi.premiumLevel === "top" || fundi.premiumLevel === "verified") && (
                                <span className="rounded bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[8px] font-extrabold text-white uppercase tracking-wide flex items-center gap-0.5 shadow-xs">
                                  ★ Premium
                                </span>
                              )}
                              {fundi.isEmergency && (
                                <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.2 text-[8px] font-extrabold text-emerald-500 uppercase tracking-wide">
                                  On-Call ⚡
                                </span>
                              )}
                            </div>
                            <CardDescription className="text-xs font-semibold text-muted-foreground mt-0.5">
                              {fundi.title}
                            </CardDescription>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-md border border-amber-500/10">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs font-extrabold">
                            {fundi.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-4">
                      {fundi.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {fundi.description}
                        </p>
                      )}

                      <div className="grid grid-cols-3 gap-2.5 pt-2 text-[11px] border-t border-border/30">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Briefcase className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          <span className="truncate">{fundi.yearsExperience} Experience</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          <span className="truncate">{fundi.serviceArea || "Nairobi"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          <span className="truncate">Preferred: {fundi.preferredContact}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1 border-t border-border/10">
                        <div className="text-[10px] text-muted-foreground">
                          Matching Trade: <span className="font-bold text-foreground">{fundi.trade}</span>
                        </div>
                        <div className="flex gap-2">
                          {fundi.user?.phone && (
                            <>
                              <Button size="xs" variant="outline" asChild className="h-8 text-[11px] font-medium rounded-lg">
                                <a href={`tel:${fundi.user.phone}`} className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" /> Call
                                </a>
                              </Button>
                              <Button size="xs" asChild className="h-8 text-[11px] font-bold rounded-lg">
                                <a 
                                  href={`https://wa.me/${fundi.user.phone.replace(/[^0-9]/g, "")}?text=Hello%20${fundi.user.name},%20I%20saw%20your%20expert%20profile%20on%20FundiHub%20and%20I%20would%20like%20to%20discuss%20a%20${profile?.projectCategory || "project"}%20repair%20job.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1"
                                >
                                  <MessageSquare className="h-3 w-3" /> WhatsApp
                                </a>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border bg-card/40 p-8 text-center shadow-xs">
                <Inbox className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                <h3 className="text-sm font-bold text-foreground">No matches at the moment</h3>
                <p className="mt-1.5 text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  We match verified local fundis based on your exact category selection ({profile?.projectCategory || "None"}). Update your project needs on the right to trigger matching matches instantly.
                </p>
              </Card>
            )}
          </div>

          {/* Interactive Requirements Update Form */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Update Project Needs
            </h2>

            <Card className="border-border bg-card shadow-sm">
              <CardContent className="pt-5">
                <form onSubmit={handleUpdateRequirements} className="space-y-4">
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
                      placeholder="e.g. John Doe"
                      className="w-full text-xs rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-category" className="text-xs font-bold text-foreground">
                      Service Category Needed
                    </Label>
                    <select
                      id="edit-category"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="flex h-9.5 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:bg-input/30"
                      required
                    >
                      <option value="">Select category...</option>
                      {TRADES_LIST.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-location" className="text-xs font-bold text-foreground">
                      Project Location
                    </Label>
                    <Input
                      id="edit-location"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="e.g. Nairobi, Kilimani"
                      className="w-full text-xs rounded-lg"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-budget" className="text-xs font-bold text-foreground">
                        Target Budget
                      </Label>
                      <select
                        id="edit-budget"
                        value={editBudget}
                        onChange={(e) => setEditBudget(e.target.value)}
                        className="flex h-9.5 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:bg-input/30"
                        required
                      >
                        <option value="">Select budget...</option>
                        <option value="Under KES 2,000">Under KES 2,000</option>
                        <option value="KES 2,000 - 5,000">KES 2,000 - 5,000</option>
                        <option value="KES 5,000 - 10,000">KES 5,000 - 10,000</option>
                        <option value="KES 10,000 - 20,000">KES 10,000 - 20,000</option>
                        <option value="Over KES 20,000">Over KES 20,000</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="edit-urgency" className="text-xs font-bold text-foreground">
                        Match Urgency
                      </Label>
                      <select
                        id="edit-urgency"
                        value={editUrgency}
                        onChange={(e) => setEditUrgency(e.target.value)}
                        className="flex h-9.5 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:bg-input/30"
                        required
                      >
                        <option value="">Select urgency...</option>
                        <option value="Today / Immediate">Today / Immediate</option>
                        <option value="Within 3 Days">Within 3 Days</option>
                        <option value="Within a Week">Within a Week</option>
                        <option value="Flexible / Planning">Flexible / Planning</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full font-bold h-9.5 text-xs rounded-lg cursor-pointer mt-2"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Saving Changes...
                      </>
                    ) : (
                      "Save Project Listing"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
