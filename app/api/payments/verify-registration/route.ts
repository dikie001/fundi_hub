import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { logAudit } from "@/lib/audit"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reference, userId } = body

    if (!reference || !userId) {
      return NextResponse.json(
        { error: "Reference and user ID are required" },
        { status: 400 }
      )
    }

    // Verify payment with Paystack
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY not configured")
      return NextResponse.json(
        { error: "Payment configuration error" },
        { status: 500 }
      )
    }

    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    )

    const verifyData = await verifyResponse.json()

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      )
    }

    // Double check transaction amount is KES 200 (Paystack returns amount in kobo/cents, so 200 * 100 = 20000)
    const expectedAmountInCents = 200 * 100
    if (verifyData.data.amount < expectedAmountInCents) {
      return NextResponse.json(
        { error: "Incorrect payment amount" },
        { status: 400 }
      )
    }

    // Update user's registration status
    const updatedProfile = await db.fundiProfile.update({
      where: { userId },
      data: { isRegistrationPaid: true },
    })

    // Log registration payment success
    await logAudit({
      action: "REGISTRATION_PAYMENT",
      details: `User registration fee paid successfully (Payment Ref: ${reference})`,
      userId,
    })

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    })
  } catch (error) {
    console.error("Error verifying registration payment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
