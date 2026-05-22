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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "../../components/page-header"

type Status = "pending" | "registered" | "paid"

interface ReferralRow {
  id: string
  refereeName: string
  refereePhone: string
  refereeTrade: string
  status: Status
  commission: number
  createdAt: string
  referrer: {
    id: string
    name: string
    phone: string
    role: string
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString()
}

const STATUS_COLORS: Record<Status, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  registered: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
}

export function ReferralsClient() {
  const [referrals, setReferrals] = useState<ReferralRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ReferralRow | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set("q", query.trim())
      if (statusFilter !== "all") params.set("status", statusFilter)
      const res = await fetch(`/api/admin/referrals?${params.toString()}`, {
        cache: "no-store",
      })
      const data = await res.json()
      setReferrals(data.referrals ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [query, statusFilter])

  useEffect(() => {
    const t = setTimeout(load, 200)
    return () => clearTimeout(t)
  }, [load])

  const changeStatus = async (r: ReferralRow, status: Status) => {
    setUpdatingId(r.id)
    try {
      await fetch(`/api/admin/referrals/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      await load()
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsSubmitting(true)
    try {
      await fetch(`/api/admin/referrals/${deleteTarget.id}`, {
        method: "DELETE",
      })
      setDeleteTarget(null)
      await load()
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalCommission = referrals
    .filter((r) => r.status === "paid")
    .reduce((s, r) => s + r.commission, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referrals"
        description="Track referrals and mark commission payouts."
      />

      <div className="grid grid-cols-3 gap-3">
        <Pill label="Total" value={referrals.length} />
        <Pill
          label="Paid commissions"
          value={`KES ${totalCommission.toLocaleString()}`}
        />
        <Pill
          label="Pending"
          value={referrals.filter((r) => r.status === "pending").length}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by referee, referrer or trade"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as Status | "all")}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="registered">Registered</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
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
                  <th className="p-3 text-left">Referrer</th>
                  <th className="p-3 text-left">Referee</th>
                  <th className="p-3 text-left">Trade</th>
                  <th className="p-3 text-left">Commission</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Created</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-border/40 hover:bg-muted/30"
                  >
                    <td className="p-3">
                      <div className="font-medium">{r.referrer.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {r.referrer.phone}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{r.refereeName}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {r.refereePhone}
                      </div>
                    </td>
                    <td className="p-3">{r.refereeTrade}</td>
                    <td className="p-3">KES {r.commission.toLocaleString()}</td>
                    <td className="p-3">
                      <Select
                        value={r.status}
                        onValueChange={(v) => changeStatus(r, v as Status)}
                        disabled={updatingId === r.id}
                      >
                        <SelectTrigger
                          className={`h-7 w-32 border-0 px-2 text-[10px] font-medium capitalize ${STATUS_COLORS[r.status]}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="registered">Registered</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(r)}
                          className="cursor-pointer text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {referrals.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No referrals match this filter.
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
            <DialogTitle>Delete referral?</DialogTitle>
            <DialogDescription>
              This permanently removes the referral record.
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

function Pill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card px-3 py-2">
      <div className="text-[10px] font-medium text-muted-foreground uppercase">
        {label}
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  )
}
