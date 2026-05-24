"use client"

import { useEffect, useState } from "react"
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
  Check,
  AlertCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EditProfileDialog } from "./edit-profile-dialog"
import { AddPortfolioDialog } from "./add-portfolio-dialog"
import type { FundiProfileData, SafeUser } from "@/lib/types"

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
  user: SafeUser | null
  profile: FundiProfileData | null
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
  isAvatarUploading: boolean
  handleAvatarUpload: (file: File) => Promise<boolean>
  portfolioItems: PortfolioItem[]
  isAddPortfolioOpen: boolean
  setIsAddPortfolioOpen: (val: boolean) => void
  completionScore: number
  isUpdating: boolean
  updateSuccess: string
  updateError: string
  handleUpdateProfile: (e: React.FormEvent) => Promise<boolean>
  openPremiumModal: () => void
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
  isAvatarUploading,
  handleAvatarUpload,
  portfolioItems,
  isAddPortfolioOpen,
  setIsAddPortfolioOpen,
  completionScore,
  isUpdating,
  updateSuccess,
  updateError,
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
  const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false)
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("")

  useEffect(() => {
    if (!pendingAvatarFile) {
      setAvatarPreviewUrl("")
      return
    }

    const objectUrl = URL.createObjectURL(pendingAvatarFile)
    setAvatarPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [pendingAvatarFile])

  const onEditProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await handleUpdateProfile(e)
    if (success) {
      setIsEditProfileOpen(false)
    }
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

  const onSelectAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingAvatarFile(file)
    setIsAvatarPreviewOpen(true)
    e.target.value = ""
  }

  const onConfirmAvatarUpload = async () => {
    if (!pendingAvatarFile) return
    const success = await handleAvatarUpload(pendingAvatarFile)
    if (success) {
      setIsAvatarPreviewOpen(false)
      setPendingAvatarFile(null)
    }
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

      {(isUpdating || isAvatarUploading || isPortfolioUploading) && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving your profile updates...
        </div>
      )}

      {updateSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-500">
          <Check className="h-4 w-4" />
          {updateSuccess}
        </div>
      )}

      {updateError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2 text-xs text-destructive">
          <AlertCircle className="h-4 w-4" />
          {updateError}
        </div>
      )}

      <Card className="border border-border/40 bg-card p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="group relative h-20 w-20 shrink-0">
              <input
                type="file"
                id="avatar-upload-profile"
                accept="image/*"
                className="hidden"
                onChange={onSelectAvatar}
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
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-all group-hover:bg-black/35">
                  <Camera className="h-5 w-5 text-white opacity-85 transition-opacity group-hover:opacity-100" />
                </div>
              </label>
              <button
                type="button"
                onClick={() =>
                  document.getElementById("avatar-upload-profile")?.click()
                }
                className="absolute -right-1 -bottom-1 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground shadow-md"
              >
                <Camera className="h-3 w-3" />
                Edit
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-start">
                <h2 className="text-xl font-extrabold text-foreground">
                  {editName || user?.name || "Fundi Partner"}
                </h2>
                {profile?.isPremium && (
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
              disabled={isUpdating}
              className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border-border/60 px-4 text-sm font-semibold shadow-xs hover:bg-muted md:w-auto"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <PenLine className="h-4 w-4" /> Edit Profile
                </>
              )}
            </Button>
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

      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        editName={editName}
        setEditName={setEditName}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editTrades={editTrades}
        setEditTrades={setEditTrades}
        editYearsExp={editYearsExp}
        setEditYearsExp={setEditYearsExp}
        editArea={editArea}
        setEditArea={setEditArea}
        editDesc={editDesc}
        setEditDesc={setEditDesc}
        preferredContact={preferredContact}
        setPreferredContact={setPreferredContact}
        skillsInputValue={skillsInputValue}
        handleSkillsChange={handleSkillsChange}
        isUpdating={isUpdating}
        onSubmit={onEditProfileSubmit}
      />

      <AddPortfolioDialog
        open={isAddPortfolioOpen}
        onOpenChange={setIsAddPortfolioOpen}
        newPortfolioTitle={newPortfolioTitle}
        setNewPortfolioTitle={setNewPortfolioTitle}
        newPortfolioCategory={newPortfolioCategory}
        setNewPortfolioCategory={setNewPortfolioCategory}
        portfolioFile={portfolioFile}
        setPortfolioFile={setPortfolioFile}
        isPortfolioUploading={isPortfolioUploading}
        portfolioProgress={portfolioProgress}
        onSubmit={handlePortfolioUpload}
      />

      <Dialog open={isAvatarPreviewOpen} onOpenChange={setIsAvatarPreviewOpen}>
        <DialogContent className="w-full max-w-xs rounded-xl border border-border bg-card p-5 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              Preview Profile Photo
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Review your new photo before uploading it.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-2">
            {avatarPreviewUrl ? (
              <img
                src={avatarPreviewUrl}
                alt="New profile preview"
                className="h-28 w-28 rounded-full border-2 border-border object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-border bg-muted text-muted-foreground">
                No preview
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsAvatarPreviewOpen(false)
                setPendingAvatarFile(null)
              }}
              disabled={isAvatarUploading}
              className="h-9"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirmAvatarUpload}
              disabled={isAvatarUploading || !pendingAvatarFile}
              className="h-9"
            >
              {isAvatarUploading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Confirm Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
