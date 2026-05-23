"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import type { PaystackButtonProps } from "./paystack-button-client"

const PaystackButtonClient = dynamic(
  () =>
    import("./paystack-button-client").then(
      (module) => module.PaystackButtonClient
    ),
  { ssr: false }
)

export function PaystackButton({
  disabled = false,
  children,
  className,
  ...props
}: PaystackButtonProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button disabled={true} className={className}>
        {children}
      </Button>
    )
  }

  return (
    <PaystackButtonClient
      {...props}
      disabled={disabled}
      className={className}
    >
      {children}
    </PaystackButtonClient>
  )
}
