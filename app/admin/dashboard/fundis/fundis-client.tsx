"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, Search, Pencil, Trash2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { PageHeader } from "../../components/page-header"

type Premium = "none" | "verified" | "top"

interface FundiRow {
  id: string
  userId: string
  title: string
  category: string
  trade: string
  yearsExperience: string
  serviceArea: string
  rating: number
  reviews: number
  jobsCompleted: number
  successRate: number
  jobEarnings: number
  premiumLevel: Premium
  isAvailable: boolean
  isNearby: boolean
  description: string | null
  skills: string
  user: {
    id: string
    name: string
    phone: string
    email: string | null
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString()
}

export function FundisClient() {
  const [fundis, setFundis] = useState<FundiRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [tier, setTier] = useState<Premium | "all">("all")
  const [editing, setEditing] = useState<FundiRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<FundiRow | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  // Form fields
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [serviceArea, setServiceArea] = useState("")
  const [skills, setSkills] = useState("")
  const [description, setDescription] = useState("")
  const [premiumLevel, setPremiumLevel] = useState<Premium>("none")
  const [isAvailable, setIsAvailable] = useState(false)
  const [isNearby, setIsNearby] = useState(false)
  const [rating, setRating] = useState("5")
  const [reviews, setReviews] = useState("0")
  const [jobsCompleted, setJobsCompleted] = useState("0")
  const [jobEarnings, setJobEarnings] = useState("0")

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set("q", query.trim())
      if (tier !== "all") params.set("premium", tier)
      const res = await fetch(`/api/admin/fundis?${params.toString()}`, {
        cache: "no-store",
      })
      const data = await res.json()
      setFundis(data.fundis ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [query, tier])

  useEffect(() => {
    const t = setTimeout(load, 200)
    return () => clearTimeout(t)
  }, [load])

  const openEdit = (f: FundiRow) => {
    setEditing(f)
    setTitle(f.title)
    setCategory(f.category)
    setServiceArea(f.serviceArea)
    setSkills(f.skills)
    setDescription(f.description ?? "")
    setPremiumLevel(f.premiumLevel)
    setIsAvailable(f.isAvailable)
    setIsNearby(f.isNearby)
    setRating(String(f.rating))
    setReviews(String(f.reviews))
    setJobsCompleted(String(f.jobsCompleted))
    setJobEarnings(String(f.jobEarnings))
    setFormError("")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setIsSubmitting(true)
    setFormError("")
    try {
      const res = await fetch(`/api/admin/fundis/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          serviceArea,
          skills,
          description,
          premiumLevel,
          isAvailable,
          isNearby,
          rating: parseFloat(rating) || 0,
          reviews: parseInt(reviews) || 0,
          jobsCompleted: parseInt(jobsCompleted) || 0,
          jobEarnings: parseFloat(jobEarnings) || 0,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || "Failed to save changes")
      } else {
        setEditing(null)
        await load()
      }
    } catch {
      setFormError("Network error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsSubmitting(true)
    try {
      await fetch(`/api/admin/fundis/${deleteTarget.id}`, { method: "DELETE" })
      setDeleteTarget(null)
      await load()
    } finally {
      setIsSubmitting(false)
    }
  }

  const tierBadge = (level: Premium) => {
    const map: Record<Premium, string> = {
      top: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
      verified: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
      none: "bg-muted text-muted-foreground",
    }
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${map[level]}`}
      >
        {level !== "none" && <ShieldCheck className="h-3 w-3" />}
        {level}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fundis"
        description="Verify, promote and moderate fundi profiles."
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, trade, area"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={tier}
          onValueChange={(v) => setTier(v as Premium | "all")}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tiers</SelectItem>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="none">Standard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-muted/50 text-[10px] text-muted-foreground uppercase">
                <tr>
                  <th className="p-3 text-left">Fundi</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Tier</th>
                  <th className="p-3 text-left">Rating</th>
                  <th className="p-3 text-left">Jobs</th>
                  <th className="p-3 text-left">Earnings</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fundis.map((f) => (
                  <tr
                    key={f.id}
                    className="border-t border-border/40 hover:bg-muted/30"
                  >
                    <td className="p-3">
                      <div className="font-medium">{f.user.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {f.title} · {f.serviceArea}
                      </div>
                    </td>
                    <td className="p-3">{f.category}</td>
                    <td className="p-3">{tierBadge(f.premiumLevel)}</td>
                    <td className="p-3">
                      {f.rating.toFixed(1)}★ ({f.reviews})
                    </td>
                    <td className="p-3">{f.jobsCompleted}</td>
                    <td className="p-3">
                      KES {Math.round(f.jobEarnings).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(f)}
                          className="cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(f)}
                          className="cursor-pointer text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {fundis.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No fundis match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit fundi profile</DialogTitle>
            <DialogDescription>
              {editing?.user.name} · {editing?.user.phone}
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <form onSubmit={handleSave} className="space-y-3">
              {formError && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Title">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>
                <Field label="Category">
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </Field>
                <Field label="Service area">
                  <Input
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
                  />
                </Field>
                <Field label="Premium tier">
                  <Select
                    value={premiumLevel}
                    onValueChange={(v) => setPremiumLevel(v as Premium)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Standard</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="top">Top</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Rating">
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </Field>
                <Field label="Reviews">
                  <Input
                    type="number"
                    min="0"
                    value={reviews}
                    onChange={(e) => setReviews(e.target.value)}
                  />
                </Field>
                <Field label="Jobs completed">
                  <Input
                    type="number"
                    min="0"
                    value={jobsCompleted}
                    onChange={(e) => setJobsCompleted(e.target.value)}
                  />
                </Field>
                <Field label="Earnings (KES)">
                  <Input
                    type="number"
                    min="0"
                    value={jobEarnings}
                    onChange={(e) => setJobEarnings(e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Skills (comma separated)">
                <Input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </Field>
              <Field label="Description">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
                />
              </Field>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs">
                  <Switch
                    checked={isAvailable}
                    onCheckedChange={setIsAvailable}
                  />
                  Available
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <Switch checked={isNearby} onCheckedChange={setIsNearby} />
                  Nearby
                </label>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(null)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  )}
                  Save
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete fundi profile?</DialogTitle>
            <DialogDescription>
              {deleteTarget?.user.name}'s fundi profile, reviews and portfolio
              will be removed. The user account is preserved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  )
}
