"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader } from "../../components/page-header"

interface ClientRow {
  id: string
  userId: string
  projectCategory: string | null
  projectLocation: string | null
  budgetRange: string | null
  urgency: string | null
  user: {
    id: string
    name: string
    phone: string
    email: string | null
    createdAt: string
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString()
}

export function ClientsClient() {
  const [clients, setClients] = useState<ClientRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<ClientRow | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set("q", query.trim())
      const res = await fetch(`/api/admin/clients?${params.toString()}`, {
        cache: "no-store",
      })
      const data = await res.json()
      setClients(data.clients ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [query])

  useEffect(() => {
    const t = setTimeout(load, 200)
    return () => clearTimeout(t)
  }, [load])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsSubmitting(true)
    try {
      await fetch(`/api/admin/users/${deleteTarget.userId}`, {
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
        title="Clients"
        description="Browse client accounts and their requested projects."
      />

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, location or category"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
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
                  <th className="p-3 text-left">Client</th>
                  <th className="p-3 text-left">Looking for</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Budget</th>
                  <th className="p-3 text-left">Urgency</th>
                  <th className="p-3 text-left">Joined</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-border/40 hover:bg-muted/30"
                  >
                    <td className="p-3">
                      <div className="font-medium">{c.user.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {c.user.phone}
                      </div>
                    </td>
                    <td className="p-3">{c.projectCategory ?? "—"}</td>
                    <td className="p-3">{c.projectLocation ?? "—"}</td>
                    <td className="p-3">{c.budgetRange ?? "—"}</td>
                    <td className="p-3">{c.urgency ?? "—"}</td>
                    <td className="p-3 text-muted-foreground">
                      {formatDate(c.user.createdAt)}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(c)}
                          className="cursor-pointer text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No clients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete client account?</DialogTitle>
            <DialogDescription>
              This permanently removes {deleteTarget?.user.name}'s account and
              project history.
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
