"use client"

import { useState } from "react"
import {
  Camera,
  ShieldCheck,
  Star,
  PenLine,
  MapPin,
  MessageSquare,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const FUNDI_TRADES = [
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

type PortfolioItem = {
  id: string
  title: string
  category: string
  image: string
}

type ProfileTabProps = {
  user: any
  profile: any
  editName: string
  setEditName: (val: string) => void
  editTitle: string
  setEditTitle: (val: string) => void
  editTrades: string[]
  setEditTrades: React.Dispatch<React.SetStateAction<string[]>>
  editYearsExp: string
  setEditYearsExp: (val: string) => void
  editArea: string
  setEditArea: (val: string) => void
  editDesc: string
  setEditDesc: (val: string) => void
  preferredContact: string
  setPreferredContact: (val: string) => void
  skills: string[]
  setSkills: (val: string[]) => void
  avatarUrl: string
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  portfolioItems: PortfolioItem[]
  isAddPortfolioOpen: boolean
  setIsAddPortfolioOpen: (val: boolean) => void
  completionScore: number
  isUpdating: boolean
  updateSuccess: string
  handleUpdateProfile: (e: React.FormEvent) => void
  openPremiumModal: (type: "verified" | "top") => void
  newPortfolioTitle: string
  setNewPortfolioTitle: (val: string) => void
  newPortfolioCategory: string
  setNewPortfolioCategory: (val: string) => void
  portfolioFile: File | null
  setPortfolioFile: (val: File | null) => void
  isPortfolioUploading: boolean
  portfolioProgress: number
  handlePortfolioUpload: (e: React.FormEvent) => void
}

export function ProfileTab({
  user,
  profile,
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
  skills,
  setSkills,
  avatarUrl,
  handleAvatarChange,
  portfolioItems,
  isAddPortfolioOpen,
  setIsAddPortfolioOpen,
  completionScore,
  isUpdating,
  updateSuccess,
  handleUpdateProfile,
  openPremiumModal,
  newPortfolioTitle,
  setNewPortfolioTitle,
  newPortfolioCategory,
  setNewPortfolioCategory,
  portfolioFile,
  setPortfolioFile,
  isPortfolioUploading,
  portfolioProgress,
  handlePortfolioUpload,
}: ProfileTabProps) {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [skillsInputValue, setSkillsInputValue] = useState(skills.join(", "))

  const onEditProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleUpdateProfile(e)
    setIsEditProfileOpen(false)
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSkillsInputValue(val)
    setSkills(
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  }

  return (
    <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">
            Profile & Portfolio
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage your public profile and portfolio showcase.
          </p>
        </div>
      </div>

      <Card className="border border-border/40 bg-card p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="group relative h-20 w-20 shrink-0">
              <input
                type="file"
                id="avatar-upload-profile"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <label
                htmlFor="avatar-upload-profile"
                className="absolute inset-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-border bg-linear-to-br from-primary to-orange-500 text-2xl font-extrabold text-white shadow-sm transition-all hover:border-primary hover:shadow-md"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user?.name?.[0]?.toUpperCase()
                )}
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-all group-hover:bg-black/40">
                  <Camera className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </label>
            </div>

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
                  `${(editTrades && editTrades[0]) || "General"} Specialist`}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
                {(editTrades.length > 0 ? editTrades : ["General"]).map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                  >
                    {t}
                  </span>
                ))}
                <span className="inline-flex items-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500">
                  {editYearsExp || "0"} Years Experience
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />{" "}
                  {profile?.rating?.toFixed(1) || "5.0"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-2.5 md:w-auto md:items-end">
            <Button
              onClick={() => setIsEditProfileOpen(true)}
              variant="outline"
              className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border-border/60 px-4 text-sm font-semibold shadow-xs hover:bg-muted md:w-auto"
            >
              <PenLine className="h-4 w-4" /> Edit Profile
            </Button>
            {updateSuccess && (
              <span className="text-[11px] font-medium text-emerald-500">
                {updateSuccess}
              </span>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="space-y-4 border border-border/40 bg-card p-6">
          <div className="flex items-center justify-between border-b border-border/30 pb-3">
            <h3 className="text-sm font-bold text-foreground">
              Identity & Scope
            </h3>
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
          </div>
        </Card>

        <Card className="space-y-4 border border-border/40 bg-card p-6 md:col-span-2">
          <div className="flex items-center justify-between border-b border-border/30 pb-3">
            <h3 className="text-sm font-bold text-foreground">
              Bio Story & Skills
            </h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-sm font-semibold text-foreground">
                Professional Bio
              </span>
              <p className="min-h-24 rounded-lg border border-border/20 bg-muted/10 p-3 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {editDesc ||
                  "No professional biography written yet. Click 'Edit Profile' to add details."}
              </p>
            </div>
            <div className="space-y-2 pt-1">
              <span className="text-sm font-semibold text-foreground">
                Specializations
              </span>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded border border-border/30 bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    No specializations added.
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border border-border/40 bg-card">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/25 px-6 py-4">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Works Showcase Portfolio ({portfolioItems.length})
            </CardTitle>
            <CardDescription className="mt-0.5 text-sm text-muted-foreground">
              Real photos of recent customer repairs and installations you
              completed.
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
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted via-background to-muted/30 text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/10 to-transparent p-3.5">
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
              Your profile completion score is {completionScore}%. Complete all
              details to boost your matching priority.
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddPortfolioOpen(true)}
          size="sm"
          className="h-10 cursor-pointer rounded-lg px-4 text-sm font-semibold"
        >
          Complete Profile Setup
        </Button>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-6xl overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-semibold">
              Edit Profile Details
            </DialogTitle>
            <DialogDescription className="text-base">
              Update your professional information
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onEditProfileSubmit} className="space-y-8 pt-6">
            {/* Basic Info - 2 Columns on Large Screens */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2.5">
                <Label htmlFor="edit-name" className="text-base">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your full name"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="edit-title" className="text-base">Professional Title</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Electrician Expert"
                  className="h-11"
                  required
                />
              </div>
            </div>

            {/* Trade Categories - Full Width */}
            <div className="space-y-2.5">
              <Label className="text-base">Trade Categories</Label>
              <Select
                onValueChange={(value) => {
                  if (!editTrades.includes(value)) {
                    setEditTrades([...editTrades, value])
                  }
                }}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Add a trade..." />
                </SelectTrigger>
                <SelectContent>
                  {FUNDI_TRADES.map((trade) => (
                    <SelectItem key={trade} value={trade}>
                      {trade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editTrades.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {editTrades.map((trade) => (
                    <Badge
                      key={trade}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm"
                    >
                      {trade}
                      <button
                        type="button"
                        onClick={() => setEditTrades(editTrades.filter((t) => t !== trade))}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Select one or more trades that appear on your profile
              </p>
            </div>

            {/* Years of Experience & Service Area - 2 Columns */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2.5">
                <Label htmlFor="edit-exp" className="text-base">Years of Experience</Label>
                <Input
                  id="edit-exp"
                  type="number"
                  value={editYearsExp}
                  onChange={(e) => setEditYearsExp(e.target.value)}
                  placeholder="10"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="edit-area" className="text-base">Service Coverage Area</Label>
                <Input
                  id="edit-area"
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  placeholder="e.g. Nairobi, Westlands, Kilimani"
                  className="h-11"
                  required
                />
              </div>
            </div>

            {/* Preferred Contact & Specializations - 2 Columns */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2.5">
                <Label htmlFor="edit-contact" className="text-base">Preferred Contact Method</Label>
                <Select value={preferredContact} onValueChange={setPreferredContact}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="edit-skills" className="text-base">
                  Specializations (comma-separated)
                </Label>
                <Input
                  id="edit-skills"
                  value={skillsInputValue}
                  onChange={handleSkillsChange}
                  placeholder="e.g. Pipe Leak Repair, Drainage Installation"
                  className="h-11"
                />
              </div>
            </div>

            {/* Professional Bio - Full Width */}
            <div className="space-y-2.5">
              <Label htmlFor="edit-desc-dialog" className="text-base">Professional Biography</Label>
              <textarea
                id="edit-desc-dialog"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Describe your expertise, experience, and what makes you stand out..."
                rows={5}
                className="flex w-full resize-none rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              />
            </div>

            <DialogFooter className="gap-2 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditProfileOpen(false)}
                className="h-11 px-6"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating} className="h-11 px-6">
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Portfolio Dialog */}
      <Dialog open={isAddPortfolioOpen} onOpenChange={setIsAddPortfolioOpen}>
        <DialogContent className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Add Portfolio Work
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Showcase pictures of jobs you did recently to attract clients.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePortfolioUpload} className="mt-2 space-y-4">
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
                onChange={(e) => setNewPortfolioTitle(e.target.value)}
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
                onChange={(e) => setNewPortfolioCategory(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-hidden dark:bg-card"
              >
                <option value="Wiring">Electrical Wiring</option>
                <option value="Installation">Equipment Installation</option>
                <option value="Repair">Trouble Repair</option>
                <option value="Piping">Plumbing Piping</option>
                <option value="General">Other Works</option>
              </select>
            </div>
            <div className="rounded-lg border border-dashed border-border/40 bg-muted/15 p-5 text-center">
              <input
                type="file"
                id="portfolio-upload-file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setPortfolioFile(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="portfolio-upload-file"
                className="block cursor-pointer"
              >
                <ImageIcon className="mx-auto mb-1.5 h-7 w-7 text-primary" />
                <p className="text-sm font-semibold text-foreground">
                  {portfolioFile
                    ? portfolioFile.name
                    : "Select photo of your work"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
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
                className="h-10 cursor-pointer rounded-lg px-4 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 cursor-pointer rounded-lg px-4 text-sm font-semibold"
                disabled={isPortfolioUploading}
              >
                {isPortfolioUploading
                  ? `Uploading ${portfolioProgress}%`
                  : "Save Work"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
