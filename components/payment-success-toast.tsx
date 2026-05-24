"use client"

import { useEffect } from "react"
import { Check, X } from "lucide-react"

type PaymentSuccessToastProps = {
  open: boolean
  title: string
  description: string
  onDismiss: () => void
}

export function PaymentSuccessToast({
  open,
  title,
  description,
  onDismiss,
}: PaymentSuccessToastProps) {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(onDismiss, 10000)
    return () => clearTimeout(timer)
  }, [open, onDismiss])

  if (!open) return null

  return (
    <div className="fixed right-4 bottom-4 z-70 w-[min(90vw,360px)] animate-in duration-200 fade-in slide-in-from-bottom-1">
      <div className="rounded-lg border border-primary/40 bg-card shadow-lg ring-1 shadow-primary/20 ring-primary/20">
        <div className="flex items-start gap-3 p-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
            <Check className="h-4 w-4 text-primary" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-primary">{title}</h3>
              <button
                type="button"
                onClick={onDismiss}
                className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
