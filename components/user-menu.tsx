"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { useTheme } from "next-themes"
import { Moon, Sun, LogOut, User, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserMenuProps {
  name?: string
  phone?: string
  image?: string
  role?: string
  onLogout: () => void
  /** visual variant — "navbar" (light pill) or "topbar" (gradient avatar used in fundi) */
  variant?: "navbar" | "topbar"
}

export function UserMenu({
  name,
  phone,
  image,
  role,
  onLogout,
  variant = "navbar",
}: UserMenuProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?"

  const roleLabel =
    role === "fundi" ? "Partner Account" : role === "admin" ? "Admin" : "Client Account"

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-xl border transition-colors",
            variant === "topbar"
              ? "border-border/10 bg-muted/40 px-2.5 py-1.5 hover:bg-muted/70"
              : "border-border/40 bg-card/60 px-2.5 py-1.5 hover:bg-muted/60"
          )}
          aria-label="Open user menu"
        >
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                variant === "topbar"
                  ? "bg-linear-to-br from-primary to-orange-500 shadow-xs"
                  : "bg-primary/90"
              )}
            >
              {initials}
            </div>
          )}
          <span className="hidden max-w-28 truncate text-xs font-semibold text-foreground sm:block">
            {name}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 w-56 rounded-xl border border-border bg-card p-1.5 text-card-foreground shadow-lg outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
        >
          {/* Identity */}
          <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 px-3 py-2.5 mb-1">
            {image ? (
              <img
                src={image}
                alt={name}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="truncate text-xs font-bold text-foreground">{name}</div>
              <div className="truncate text-[10px] text-muted-foreground">{phone || roleLabel}</div>
            </div>
          </div>

          {/* Theme toggle */}
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-3.5 w-3.5 text-amber-500" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
              )}
              {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          )}

          <div className="my-1 h-px bg-border/50" />

          {/* Sign out */}
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
