"use client"

import { useDashboard } from "../context/DashboardContext"
import { useState, useEffect } from "react"
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Check,
  Loader2,
  Wrench,
  Phone,
  MessageSquare,
  Star,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
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
  "Gardener",
]

export default function MyProjectPage() {
  const { profile, matchedFundis, fetchData } = useDashboard()

  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editLocation, setEditLocation] = useState("")
  const [editBudget, setEditBudget] = useState("")
  const [editUrgency, setEditUrgency] = useState("")

  useEffect(() => {
    if (profile) {
      setEditCategory(profile.projectCategory || "")
      setEditLocation(profile.projectLocation || "")
      setEditBudget(profile.budgetRange || "")
      setEditUrgency(profile.urgency || "")
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateSuccess("")
    try {
      const res = await fetch("/api/client/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectCategory: editCategory,
          projectLocation: editLocation,
          budgetRange: editBudget,
          urgency: editUrgency,
        }),
      })
      if (res.ok) {
        setUpdateSuccess("Project requirements saved!")
        await fetchData()
        setTimeout(() => setUpdateSuccess(""), 4000)
      } else {
        const data = await res.json()
        alert(data.error || "Failed to save requirements.")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">My Project</h1>
        <p className="text-sm text-muted-foreground">
          Define your requirements to get matched with the right fundis.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form + Current Summary */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <Briefcase className="h-4 w-4 text-primary" /> Project
                Requirements
              </CardTitle>
              <CardDescription className="text-xs">
                Update your project details to find the best matches.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {updateSuccess && (
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-600 dark:text-emerald-400">
                    <Check className="h-4 w-4" /> {updateSuccess}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">
                    Service Category Needed
                  </Label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none dark:bg-input/30"
                    required
                  >
                    <option value="">Select category...</option>
                    {TRADES_LIST.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Project Location</Label>
                  <Input
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. Nairobi, Kilimani"
                    className="text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Target Budget</Label>
                  <select
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none dark:bg-input/30"
                    required
                  >
                    <option value="">Select budget...</option>
                    <option value="Under KES 2,000">Under KES 2,000</option>
                    <option value="KES 2,000 - 5,000">KES 2,000 - 5,000</option>
                    <option value="KES 5,000 - 10,000">
                      KES 5,000 - 10,000
                    </option>
                    <option value="KES 10,000 - 20,000">
                      KES 10,000 - 20,000
                    </option>
                    <option value="Over KES 20,000">Over KES 20,000</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Urgency</Label>
                  <select
                    value={editUrgency}
                    onChange={(e) => setEditUrgency(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none dark:bg-input/30"
                    required
                  >
                    <option value="">Select urgency...</option>
                    <option value="Today / Immediate">Today / Immediate</option>
                    <option value="Within 3 Days">Within 3 Days</option>
                    <option value="Within a Week">Within a Week</option>
                    <option value="Flexible / Planning">
                      Flexible / Planning
                    </option>
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="h-9 w-full text-xs font-bold"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save Project Requirements"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current summary */}
          <Card className="border-border bg-card/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Current Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              {[
                {
                  icon: Briefcase,
                  label: "Category",
                  value: profile?.projectCategory,
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: profile?.projectLocation,
                },
                {
                  icon: DollarSign,
                  label: "Budget",
                  value: profile?.budgetRange,
                },
                { icon: Clock, label: "Urgency", value: profile?.urgency },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{label}:</span>
                  <span className="truncate font-semibold">
                    {value || "Not set"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Matched Fundis */}
        <div className="space-y-4 lg:col-span-3">
          <div className="flex items-center gap-2">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Wrench className="h-4 w-4 text-primary" /> Matched Experts
            </h2>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              {matchedFundis.length}
            </span>
          </div>

          {matchedFundis.length > 0 ? (
            <div className="space-y-3">
              {matchedFundis.map((fundi) => (
                <Card
                  key={fundi.id}
                  className="border-border/80 bg-card transition-colors hover:border-primary/40"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        {fundi.image ? (
                          <img
                            src={fundi.image}
                            alt={fundi.name}
                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary uppercase">
                            {fundi.name?.slice(0, 2) || "FU"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-sm font-bold text-foreground">
                              {fundi.name}
                            </span>
                            {fundi.verified && (
                              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                            )}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {fundi.title}
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {fundi.rating?.toFixed(1)}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <MapPin className="h-3 w-3 text-primary" />
                              {fundi.serviceArea || "Nairobi"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {fundi.phone && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="h-8 text-xs"
                            >
                              <a href={`tel:${fundi.phone}`}>
                                <Phone className="mr-1 h-3 w-3" /> Call
                              </a>
                            </Button>
                            <Button size="sm" asChild className="h-8 text-xs">
                              <a
                                href={`https://wa.me/${fundi.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(fundi.name)},%20I%20found%20you%20on%20FundiHub.%20I%20need%20a%20${encodeURIComponent(profile?.projectCategory || "service")}%20in%20${encodeURIComponent(profile?.projectLocation || "my area")}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <MessageSquare className="mr-1 h-3 w-3" />{" "}
                                WhatsApp
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
            <Card className="border-border bg-card/40 p-8 text-center">
              <Wrench className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <h3 className="text-sm font-bold text-foreground">
                No matches found
              </h3>
              <p className="mx-auto mt-1.5 max-w-xs text-xs text-muted-foreground">
                Set a service category on the left to see matched experts.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
