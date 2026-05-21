"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue))
    } else {
      onChange([...value, optValue])
    }
  }

  const removeTag = (optValue: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(value.filter((v) => v !== optValue))
  }

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={disabled ? undefined : setOpen}
    >
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          data-slot="multi-select-trigger"
          className={cn(
            "flex min-h-10 w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-3 py-1.5 text-left text-sm shadow-xs ring-offset-background transition-colors focus:ring-1 focus:ring-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
            className
          )}
        >
          {value.length === 0 ? (
            <span className="flex-1 text-muted-foreground">{placeholder}</span>
          ) : (
            <div className="flex flex-1 flex-wrap gap-1">
              {value.map((v) => {
                const opt = options.find((o) => o.value === v)
                return (
                  <Badge
                    key={v}
                    variant="secondary"
                    className="shrink-0 gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium"
                  >
                    {opt?.label ?? v}
                    <span
                      role="button"
                      aria-label={`Remove ${opt?.label ?? v}`}
                      onPointerDown={(e) =>
                        removeTag(v, e as unknown as React.MouseEvent)
                      }
                      className="ml-0.5 cursor-pointer opacity-60 hover:text-destructive hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                )
              })}
            </div>
          )}
          <ChevronDown
            className={cn(
              "ml-auto h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={cn(
            "z-50 min-w-(--radix-popover-trigger-width) overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none",
            "data-[state=closed]:animate-out data-[state=open]:animate-in",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
        >
          {options.length > 6 && (
            <div className="border-b border-border/40 px-2 pt-1.5 pb-2">
              <input
                autoFocus
                className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">
                No results.
              </div>
            ) : (
              filtered.map((opt) => {
                const isSelected = value.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/40 bg-transparent"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-3" />}
                    </div>
                    <span>{opt.label}</span>
                  </button>
                )
              })
            )}
          </div>

          {value.length > 0 && (
            <div className="border-t border-border/40 px-1 pt-1">
              <button
                type="button"
                onClick={() => onChange([])}
                className="w-full cursor-pointer rounded-md px-2.5 py-1.5 text-center text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Clear all
              </button>
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
