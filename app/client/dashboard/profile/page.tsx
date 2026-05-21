"use client"

import { useDashboard } from "../context/DashboardContext"
import { useState, useRef, useEffect } from "react"
import {
  User,
  Phone,
  Camera,
  Check,
  Loader2,
  Save,
  KeyRound,
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
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  const { user, profile, fetchData } = useDashboard()

  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAvatarUploading, setIsAvatarUploading] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setEditName(user.name || "")
      setEditPhone(user.phone || "")
    }
    if (profile) {
      setAvatarUrl(profile.image || "")
    }
  }, [user, profile])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Validate file size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5 MB.")
      return
    }
    setIsAvatarUploading(true)
    try {
      const reader = new FileReader()
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64,
            fileName: `client_${user?.id}_avatar_${Date.now()}.jpg`,
            folder: "fundi_hub/client_avatars",
          }),
        })
        if (res.ok) {
          const data = await res.json()
          setAvatarUrl(data.url)
        } else {
          alert("Failed to upload image. Please try again.")
        }
        setIsAvatarUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error(err)
      setIsAvatarUploading(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateSuccess("")
    try {
      const res = await fetch("/api/client/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          image: avatarUrl,
        }),
      })
      if (res.ok) {
        setUpdateSuccess("Profile updated successfully!")
        await fetchData()
        setTimeout(() => setUpdateSuccess(""), 4000)
      } else {
        const data = await res.json()
        alert(data.error || "Failed to update profile.")
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
        <h1 className="text-xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar Card */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Profile Photo</CardTitle>
            <CardDescription className="text-xs">
              Update your profile picture.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-2 border-border object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-border bg-primary/10 text-2xl font-bold text-primary uppercase">
                  {user?.name?.slice(0, 2) || "CL"}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAvatarUploading}
                className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {isAvatarUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <p className="text-center text-[11px] text-muted-foreground">
              Click the camera icon to upload a new photo.
              <br />
              JPG, PNG up to 5 MB.
            </p>
            {isAvatarUploading && (
              <p className="animate-pulse text-xs text-primary">Uploading...</p>
            )}
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold">
              Personal Information
            </CardTitle>
            <CardDescription className="text-xs">
              Update your name and contact details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {updateSuccess && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" /> {updateSuccess}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Full Name</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your full name"
                      className="pl-9 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Phone Number</Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="e.g. 0712345678"
                      className="pl-9 text-xs"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Account Role</Label>
                  <div className="flex h-9 items-center rounded-lg border border-input bg-muted/30 px-3 text-xs text-muted-foreground">
                    Client Account
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Member Since</Label>
                  <div className="flex h-9 items-center rounded-lg border border-input bg-muted/30 px-3 text-xs text-muted-foreground">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-KE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isUpdating || isAvatarUploading}
                className="mt-2 h-9 w-full text-xs font-bold"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{" "}
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-1.5 h-3.5 w-3.5" /> Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Account Info */}
      <Card className="border-border/50 bg-card/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-bold">
            <KeyRound className="h-4 w-4 text-muted-foreground" /> Account
            Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Account ID:</span>
            <span className="font-mono font-semibold text-foreground">
              {user?.id}
            </span>
          </div>
          <p className="text-[11px]">
            To delete your account or reset your password, please contact
            support.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
