"use client"

import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
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
      <DialogContent className="w-full max-w-105 overflow-hidden rounded-[28px] border border-emerald-500/20 bg-linear-to-b from-card via-card to-emerald-500/5 p-0 shadow-[0_24px_80px_-28px_rgba(16,185,129,0.45)]">
        <div className="relative px-6 pt-7 pb-6 sm:px-7">
          <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.24),transparent_65%)]" />
          <div className="relative flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 shadow-inner shadow-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
          </div>

          <DialogHeader className="relative mt-5 space-y-2 text-center">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-emerald-600 uppercase dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Payment Confirmed
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground sm:text-[28px]">
              {title}
            </DialogTitle>
            <DialogDescription className="mx-auto max-w-sm text-sm leading-6 text-muted-foreground">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-6 overflow-hidden rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4 shadow-sm">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(16,185,129,0.08),transparent)]" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-emerald-600 uppercase dark:text-emerald-400">
                  Amount Paid
                </p>
                <p className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
                  {amountLabel}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/80 text-emerald-600 shadow-sm ring-1 ring-emerald-500/15 dark:text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>

            {reference ? (
              <div className="relative mt-4 rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-left shadow-sm">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Transaction Reference
                </p>
                <p className="mt-1 text-xs font-medium break-all text-foreground">
                  {reference}
                </p>
              </div>
            ) : null}
          </div>

          <div className="relative mt-6 space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-card p-3 text-left shadow-sm">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Secure
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  Verified by Paystack
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card p-3 text-left shadow-sm">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Status
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  Funds confirmed
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card p-3 text-left shadow-sm">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Next Step
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  Continue in app
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={onContinue}
              className="h-11 w-full rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:opacity-95 active:scale-[0.98]"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
