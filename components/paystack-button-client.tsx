"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

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
}: PaystackButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handlePayment = async () => {
    if (disabled || isRedirecting) return

    setIsRedirecting(true)

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
      alert(
        error instanceof Error
          ? error.message
          : "Unable to start Paystack checkout. Please try again."
      )
    }
  }

  return (
    <Button
      onClick={handlePayment}
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
  )
}
