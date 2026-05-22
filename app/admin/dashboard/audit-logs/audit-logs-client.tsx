"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "../../components/page-header"

interface AuditRow {
  id: string
  action: string
  details: string
  ipAddress: string | null
  createdAt: string
  user: {
    id: string
    name: string
    role: string
  } | null
}

function formatDate(d: string) {
  return new Date(d).toLocaleString()
}

export function AuditLogsClient() {
  const [logs, setLogs] = useState<AuditRow[]>([])
  const [actions, setActions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set("q", query.trim())
      if (actionFilter !== "all") params.set("action", actionFilter)
      params.set("take", "300")
      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`, {
        cache: "no-store",
      })
      const data = await res.json()
      setLogs(data.logs ?? [])
      setActions(data.actions ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [query, actionFilter])

  useEffect(() => {
    const t = setTimeout(load, 200)
    return () => clearTimeout(t)
  }, [load])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Every privileged action recorded across the platform."
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search action or details"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {actions.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
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
        ) : (
          <div className="max-h-[70vh] overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-muted/50 text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="p-3 text-left">When</th>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">Details</th>
                  <th className="p-3 text-left">Actor</th>
                  <th className="p-3 text-left">IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr
                    key={l.id}
                    className="border-t border-border/40 align-top hover:bg-muted/30"
                  >
                    <td className="whitespace-nowrap p-3 text-muted-foreground">
                      {formatDate(l.createdAt)}
                    </td>
                    <td className="p-3">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {l.action}
                      </span>
                    </td>
                    <td className="p-3 text-foreground/80">{l.details}</td>
                    <td className="p-3 text-muted-foreground">
                      {l.user ? `${l.user.name} (${l.user.role})` : "—"}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {l.ipAddress ?? "—"}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No audit entries.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
