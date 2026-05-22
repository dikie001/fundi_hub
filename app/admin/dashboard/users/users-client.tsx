"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Loader2, Plus, Search, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "../../components/page-header"

type Role = "client" | "fundi" | "admin"

interface AdminUser {
  id: string
  name: string
  email: string | null
  phone: string
  role: Role
  image: string | null
  createdAt: string
  fundiProfile?: {
    premiumLevel: string
    rating: number
    reviews: number
    jobsCompleted: number
    image: string | null
  } | null
  clientProfile?: {
    projectCategory: string | null
    projectLocation: string | null
    image: string | null
  } | null
}

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "client", label: "Client" },
  { value: "fundi", label: "Fundi" },
  { value: "admin", label: "Admin" },
]

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return d
  }
}

export function UsersClient() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")
  const [error, setError] = useState<string | null>(null)

  // Dialog state
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  // Form fields
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("client")

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set("q", query.trim())
      if (roleFilter !== "all") params.set("role", roleFilter)
      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        cache: "no-store",
      })
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setUsers(data.users ?? [])
      setError(null)
    } catch {
      setError("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }, [query, roleFilter])

  useEffect(() => {
    const t = setTimeout(load, 200)
    return () => clearTimeout(t)
  }, [load])

  const openCreate = () => {
    setEditing(null)
    setName("")
    setPhone("")
    setEmail("")
    setPassword("")
    setRole("client")
    setFormError("")
    setIsFormOpen(true)
  }
  const openEdit = (u: AdminUser) => {
    setEditing(u)
    setName(u.name)
    setPhone(u.phone)
    setEmail(u.email ?? "")
    setPassword("")
    setRole(u.role)
    setFormError("")
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    if (!name.trim() || !phone.trim()) {
      setFormError("Name and phone are required.")
      return
    }
    if (!editing && password.length < 6) {
      setFormError("Password must be at least 6 characters.")
      return
    }
    setIsSubmitting(true)
    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        phone: phone.trim(),
        role,
      }
      if (email.trim()) body.email = email.trim()
      if (password) body.password = password

      const res = editing
        ? await fetch(`/api/admin/users/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch("/api/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || "Failed to save user.")
      } else {
        setIsFormOpen(false)
        await load()
      }
    } catch {
      setFormError("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setDeleteTarget(null)
        await load()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const counts = useMemo(() => {
    return users.reduce(
      (acc, u) => {
        acc.total++
        acc[u.role]++
        return acc
      },
      { total: 0, client: 0, fundi: 0, admin: 0 } as Record<string, number>
    )
  }, [users])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage every account on the platform."
        actions={
          <Button size="sm" onClick={openCreate} className="cursor-pointer">
            <Plus className="mr-1 h-4 w-4" /> New user
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryPill label="Total" value={counts.total} />
        <SummaryPill label="Clients" value={counts.client} />
        <SummaryPill label="Fundis" value={counts.fundi} />
        <SummaryPill label="Admins" value={counts.admin} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(v) => setRoleFilter(v as Role | "all")}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {ROLE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs text-destructive">
            {error}
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-muted/50 text-[10px] text-muted-foreground uppercase">
                <tr>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Profile</th>
                  <th className="p-3 text-left">Joined</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-border/40 hover:bg-muted/30"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {(u.image || u.fundiProfile?.image || u.clientProfile?.image) ? (
                          <img
                            src={u.image || u.fundiProfile?.image || u.clientProfile?.image || ""}
                            alt={u.name}
                            className="h-8 w-8 rounded-full object-cover border border-border"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
                            <span className="text-xs font-medium text-muted-foreground">
                              {u.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {u.phone}
                            {u.email && ` · ${u.email}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium capitalize">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {u.role === "fundi" && u.fundiProfile && (
                        <span>
                          {u.fundiProfile.rating.toFixed(1)}★ ·{" "}
                          {u.fundiProfile.reviews} reviews ·{" "}
                          {u.fundiProfile.premiumLevel}
                        </span>
                      )}
                      {u.role === "client" && u.clientProfile && (
                        <span>
                          {u.clientProfile.projectCategory ?? "—"} ·{" "}
                          {u.clientProfile.projectLocation ?? "—"}
                        </span>
                      )}
                      {u.role === "admin" && <span>Platform admin</span>}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(u)}
                          className="cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(u)}
                          className="cursor-pointer text-destructive hover:bg-destructive/10"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No users match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / edit dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit user" : "Create user"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update account details. Leave password blank to keep current."
                : "Provision a new account on the platform."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            {formError && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {formError}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="u-name" className="text-xs">
                Full name
              </Label>
              <Input
                id="u-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="u-phone" className="text-xs">
                  Phone
                </Label>
                <Input
                  id="u-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="u-email" className="text-xs">
                  Email
                </Label>
                <Input
                  id="u-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="u-role" className="text-xs">
                  Role
                </Label>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger id="u-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="u-password" className="text-xs">
                  {editing ? "New password" : "Password"}
                </Label>
                <Input
                  id="u-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editing ? "Leave blank to keep" : "min 6 chars"}
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsFormOpen(false)}
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
                {editing ? "Save changes" : "Create user"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete user?</DialogTitle>
            <DialogDescription>
              {deleteTarget?.name} will be removed permanently along with their
              profile, referrals and reviews.
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

function SummaryPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card px-3 py-2">
      <div className="text-[10px] font-medium text-muted-foreground uppercase">
        {label}
      </div>
      <div className="text-lg font-bold">{value.toLocaleString()}</div>
    </div>
  )
}
