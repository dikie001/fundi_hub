"use client"

import { Check, ArrowRight, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type PaymentSuccessModalProps = {
  open: boolean
  title: string
  description: string
  amountLabel: string
  reference?: string | null
  onContinue: () => void
}

export function PaymentSuccessModal({
  open,
  title,
  description,
  amountLabel,
  reference,
  onContinue,
}: PaymentSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onContinue()}>
      <DialogContent className="w-full max-w-sm rounded-xl border border-primary/40 bg-card p-0 shadow-lg shadow-primary/20 ring-1 ring-primary/20">
        {/* Top accent bar */}
        <div className="h-1 w-full rounded-t-xl bg-primary" />

        <div className="space-y-5 px-6 pt-5 pb-6">
          {/* Icon + header */}
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15">
              <Check className="h-5 w-5 text-primary" strokeWidth={2.5} />
            </div>
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-base leading-tight font-bold text-primary">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
                {description}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Receipt summary */}
          <div className="space-y-2.5 rounded-lg border border-border/60 bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Amount paid</span>
              <span className="text-sm font-bold text-foreground">
                {amountLabel}
              </span>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <span className="text-xs font-semibold text-primary">
                Confirmed
              </span>
            </div>
            {reference && (
              <>
                <div className="h-px bg-border/50" />
                <div className="flex items-start justify-between gap-4">
                  <span className="shrink-0 text-xs text-muted-foreground">
                    Reference
                  </span>
                  <span className="text-right text-[11px] font-medium break-all text-foreground">
                    {reference}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Action */}
          <Button
            type="button"
            onClick={onContinue}
            className="h-10 w-full rounded-lg text-sm font-semibold transition-colors"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/60">
            <Lock className="h-3 w-3" />
            Verified by Paystack
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
