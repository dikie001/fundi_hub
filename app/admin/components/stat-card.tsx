"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "primary",
}: {
  label: string
  value: string | number
  icon?: LucideIcon
  hint?: string
  accent?: "primary" | "emerald" | "amber" | "blue" | "rose" | "violet" | "slate"
}) {
  const accents: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    slate: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  }
  return (
    <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </div>
          <div className="mt-1.5 truncate text-2xl font-bold text-foreground">
            {value}
          </div>
          {hint && (
            <div className="mt-1 truncate text-[11px] text-muted-foreground">
              {hint}
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              accents[accent]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  )
}
