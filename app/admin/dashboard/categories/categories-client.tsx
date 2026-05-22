"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
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
import { PageHeader } from "../../components/page-header"

interface Category {
  id: string
  name: string
  icon: string
  fundiCount: number
}

const COMMON_ICONS = [
  "Wrench",
  "Zap",
  "Flame",
  "Hammer",
  "Paintbrush",
  "Camera",
  "Sun",
  "Sparkles",
  "Truck",
  "Wifi",
  "Settings",
  "Home",
  "Tool",
]

export function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  const [name, setName] = useState("")
  const [icon, setIcon] = useState("Wrench")

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" })
      const data = await res.json()
      setCategories(data.categories ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setEditing(null)
    setName("")
    setIcon("Wrench")
    setFormError("")
    setIsFormOpen(true)
  }
  const openEdit = (c: Category) => {
    setEditing(c)
    setName(c.name)
    setIcon(c.icon)
    setFormError("")
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !icon.trim()) {
      setFormError("Name and icon are required.")
      return
    }
    setIsSubmitting(true)
    setFormError("")
    try {
      const res = editing
        ? await fetch(`/api/admin/categories/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, icon }),
          })
        : await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, icon }),
          })
      const data = await res.json()
      if (!res.ok) setFormError(data.error || "Failed to save")
      else {
        setIsFormOpen(false)
        await load()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsSubmitting(true)
    try {
      await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
      })
      setDeleteTarget(null)
      await load()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Service categories shown to clients and fundis."
        actions={
          <Button onClick={openCreate} size="sm" className="cursor-pointer">
            <Plus className="mr-1 h-4 w-4" /> New category
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-4"
            >
              <div>
                <div className="text-sm font-bold">{c.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  Icon: {c.icon} · {c.fundiCount} fundi
                  {c.fundiCount === 1 ? "" : "s"}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => openEdit(c)}
                  className="cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeleteTarget(c)}
                  className="cursor-pointer text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-border/60 p-8 text-center text-xs text-muted-foreground">
              No categories yet. Add the first one.
            </div>
          )}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit category" : "Create category"}
            </DialogTitle>
            <DialogDescription>
              Categories help clients discover the right fundi quickly.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            {formError && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {formError}
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Icon name (lucide-react)</Label>
              <Input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                required
                list="icon-suggestions"
              />
              <datalist id="icon-suggestions">
                {COMMON_ICONS.map((i) => (
                  <option key={i} value={i} />
                ))}
              </datalist>
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
                {editing ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete category?</DialogTitle>
            <DialogDescription>
              {deleteTarget?.name} will be removed.{" "}
              {deleteTarget?.fundiCount
                ? `${deleteTarget.fundiCount} fundi profile(s) still reference this category – they will keep the label until edited.`
                : ""}
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
