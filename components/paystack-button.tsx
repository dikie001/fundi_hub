"use client"

import { usePaystackPayment } from "react-paystack"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface PaystackButtonProps {
  amount: number // Amount in Naira (e.g., 500)
  email: string
  name: string
  phone: string
  onSuccess: (reference: string) => void
  onClose?: () => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export function PaystackButton({
  amount,
  email,
  name,
  phone,
  onSuccess,
  onClose,
  disabled,
  children,
  className,
}: PaystackButtonProps) {
  const config = {
    reference: new Date().getTime().toString(),
    email: email || "user@fundihub.com",
    amount: amount * 100, // Convert to kobo (smallest currency unit)
    publicKey:
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
      "pk_test_6a8606451e2f7083cdae07b87efb2f8c6b70eeae",
    currency: "KES",
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: name,
        },
        {
          display_name: "Phone",
          variable_name: "phone",
          value: phone,
        },
      ],
    },
  }

  const initializePayment = usePaystackPayment(config)

  const handlePayment = () => {
    initializePayment({
      onSuccess: (reference: any) => {
        onSuccess(reference.reference)
      },
      onClose: () => {
        if (onClose) {
          onClose()
        }
      },
    })
  }

  return (
    <Button onClick={handlePayment} disabled={disabled} className={className}>
      {disabled ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
