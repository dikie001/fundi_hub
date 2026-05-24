"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Loader2,
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertTriangle,
  X,
  CheckCircle2,
} from "lucide-react"

export interface PaystackButtonProps {
  amount: number
  email: string
  name: string
  phone: string
  callbackPath: string
  callbackParams?: Record<string, string>
  disabled?: boolean
  children: React.ReactNode
  className?: string
  /** Skip the pre-payment confirmation dialog */
  skipConfirmation?: boolean
}

export function PaystackButtonClient({
  amount,
  email,
  name,
  phone,
  callbackPath,
  callbackParams,
  disabled,
  children,
  className,
  skipConfirmation,
}: PaystackButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errorState, setErrorState] = useState<string | null>(null)

  const purpose = callbackParams?.purpose
  const purposeLabel =
    purpose === "premium" ? "Premium Upgrade" : "Profile Activation"
  const purposeDesc =
    purpose === "premium"
      ? "You'll be redirected to Paystack's secure checkout to complete your premium upgrade. Your badge activates instantly after payment."
      : "You'll be redirected to Paystack's secure checkout to activate your fundi profile. Once paid, your profile goes live immediately."

  const valuePoints =
    purpose === "premium"
      ? [
          "Gold verified badge on your profile",
          "5x boost in customer search results",
          "Priority lead dispatch before standard profiles",
        ]
      : [
          "Your profile goes live to thousands of clients",
          "Start receiving job leads in your area",
          "WhatsApp & call connections with clients",
        ]

  const initiatePayment = async () => {
    if (disabled || isRedirecting) return

    setIsRedirecting(true)
    setErrorState(null)

    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          email: email || "user@fundihub.com",
          name,
          phone,
          callbackPath,
          callbackParams,
        }),
      })

      const data = (await response.json()) as {
        authorizationUrl?: string
        error?: string
      }

      if (!response.ok || !data.authorizationUrl) {
        throw new Error(data.error || "Unable to start Paystack checkout")
      }

      window.location.assign(data.authorizationUrl)
    } catch (error) {
      console.error("Paystack initialization failed:", error)
      setIsRedirecting(false)
      setShowConfirm(false)
      setErrorState(
        error instanceof Error
          ? error.message
          : "Unable to start Paystack checkout. Please try again."
      )
    }
  }

  const handleClick = () => {
    if (skipConfirmation) {
      initiatePayment()
    } else {
      setShowConfirm(true)
    }
  }

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={disabled || isRedirecting}
        className={className}
      >
        {disabled || isRedirecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecting to checkout...
          </>
        ) : (
          children
        )}
      </Button>

      {/* Pre-payment confirmation dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="w-full max-w-sm overflow-hidden rounded-2xl border border-primary/15 bg-card p-0 shadow-xl">
          <div className="bg-linear-to-b from-primary/8 to-transparent px-6 pt-6 pb-4">
            <DialogHeader className="space-y-1.5 text-left">
              <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                <ShieldCheck className="h-5 w-5 text-primary" />
                {purposeLabel}
              </DialogTitle>
              <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
                {purposeDesc}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-4 px-6 pb-6">
            {/* Amount summary */}
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
              <span className="text-xs font-semibold text-muted-foreground">
                Total
              </span>
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                KSh {amount.toLocaleString()}
              </span>
            </div>

            {/* What you'll get */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                What you get
              </p>
              {valuePoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <span className="text-xs text-muted-foreground">{point}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowConfirm(false)}
                disabled={isRedirecting}
                className="h-10 flex-1 rounded-xl text-xs font-semibold text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={initiatePayment}
                disabled={isRedirecting}
                className="h-10 flex-1 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Proceed to Pay
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground/50">
              <Lock className="h-3 w-3" />
              <span>256-bit encrypted • Secured by Paystack</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error feedback toast */}
      {errorState && (
        <div className="fixed right-4 bottom-4 z-70 w-[min(92vw,400px)] animate-in duration-300 fade-in slide-in-from-bottom-2">
          <div className="overflow-hidden rounded-2xl border border-red-500/20 bg-card/95 shadow-lg backdrop-blur-xl">
            <div className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-red-600 uppercase dark:text-red-400">
                      Payment Failed
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {errorState}
                    </p>
                  </div>
                  <button
                    onClick={() => setErrorState(null)}
                    className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground/60">
                  No money was charged. Please try again or contact support.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
