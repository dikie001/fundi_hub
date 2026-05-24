"use client"

import { CheckCircle2, X, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

type PaymentSuccessToastProps = {
  open: boolean
  title: string
  description: string
  amountLabel: string
  reference?: string | null
  onDismiss: () => void
}

export function PaymentSuccessToast({
  open,
  title,
  description,
  amountLabel,
  reference,
  onDismiss,
}: PaymentSuccessToastProps) {
  if (!open) return null

  return (
    <div className="fixed right-4 bottom-4 z-70 w-[min(92vw,420px)] animate-in duration-300 fade-in slide-in-from-bottom-2">
      <div className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-card/95 shadow-[0_18px_50px_-22px_rgba(16,185,129,0.65)] backdrop-blur-xl">
        <div className="flex items-start gap-3 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-emerald-600 uppercase dark:text-emerald-400">
                  Payment Successful
                </p>
                <h3 className="mt-1 text-sm font-extrabold tracking-tight text-foreground">
                  {title}
                </h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              {description}
            </p>

            <div className="grid gap-2 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Amount
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {amountLabel}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Reference
                </p>
                <p className="mt-1 text-xs font-medium break-all text-foreground">
                  {reference || "Verified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
