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
import { Loader2, Lock, ArrowRight, X, Check } from "lucide-react"

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
    purpose === "premium" ? "Confirm Premium Upgrade" : "Confirm Activation"

  const valuePoints =
    purpose === "premium"
      ? [
          "Gold verified badge on your profile",
          "5x boost in search results",
          "Priority lead dispatch",
        ]
      : [
          "Profile goes live to clients",
          "Receive job leads in your area",
          "Direct WhatsApp & call connections",
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
          : "Unable to start checkout. Please try again."
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
            Redirecting...
          </>
        ) : (
          children
        )}
      </Button>

      {/* Pre-payment confirmation */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="w-full max-w-xs rounded-xl border border-border bg-card p-5 shadow-lg">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-sm font-bold text-foreground">
              {purposeLabel}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              You&apos;ll be redirected to Paystack to complete payment.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3.5 py-2.5">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-sm font-bold text-foreground">
                KSh {amount.toLocaleString()}
              </span>
            </div>

            <div className="space-y-1.5">
              {valuePoints.map((point, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check
                    className="h-3.5 w-3.5 shrink-0 text-primary"
                    strokeWidth={2.5}
                  />
                  <span className="text-xs text-muted-foreground">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowConfirm(false)}
              disabled={isRedirecting}
              className="h-9 flex-1 rounded-lg text-xs font-medium text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={initiatePayment}
              disabled={isRedirecting}
              className="h-9 flex-1 rounded-lg text-xs font-semibold transition-colors"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Pay Now
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>

          <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-muted-foreground/50">
            <Lock className="h-3 w-3" />
            Secured by Paystack
          </p>
        </DialogContent>
      </Dialog>

      {/* Error toast */}
      {errorState && (
        <div className="fixed right-4 bottom-4 z-70 w-[min(90vw,340px)] animate-in duration-200 fade-in slide-in-from-bottom-1">
          <div className="rounded-lg border border-destructive/20 bg-card shadow-md">
            <div className="flex items-start gap-3 p-3.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-destructive">
                    Payment failed
                  </p>
                  <button
                    onClick={() => setErrorState(null)}
                    className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {errorState}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground/60">
                  No money was charged.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
