import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { logAudit } from "@/lib/audit"

const PAYMENT_AMOUNTS = {
  premium: 500,
  registration: 200,
} as const

type PaymentPurpose = keyof typeof PAYMENT_AMOUNTS

function buildReturnUrl(origin: string, returnTo?: string, fallback = "/") {
  const target = returnTo && returnTo.startsWith("/") ? returnTo : fallback
  return new URL(target, origin)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const reference = searchParams.get("reference") || searchParams.get("trxref")
    const purpose = searchParams.get("purpose") as PaymentPurpose | null
    const returnTo = searchParams.get("returnTo") || undefined
    const premiumLevel = searchParams.get("premiumLevel")
    const userId = searchParams.get("userId")

    if (!reference || !purpose) {
      return NextResponse.redirect(buildReturnUrl(origin, returnTo, "/"))
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY not configured")
      return NextResponse.redirect(buildReturnUrl(origin, returnTo, "/"))
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
      return NextResponse.redirect(buildReturnUrl(origin, returnTo, "/"))
    }

    const expectedAmountInCents = PAYMENT_AMOUNTS[purpose] * 100
    if (verifyData.data.amount < expectedAmountInCents) {
      return NextResponse.redirect(buildReturnUrl(origin, returnTo, "/"))
    }

    if (purpose === "premium") {
      const cookieStore = await cookies()
      const sessionCookie = cookieStore.get("user_session")
      if (!sessionCookie) {
        return NextResponse.redirect(buildReturnUrl(origin, returnTo, "/"))
      }

      const user = await db.user.findUnique({
        where: { id: sessionCookie.value },
        include: { fundiProfile: true },
      })

      if (!user || user.role !== "fundi" || !premiumLevel) {
        return NextResponse.redirect(buildReturnUrl(origin, returnTo, "/"))
      }

      await db.fundiProfile.update({
        where: { userId: user.id },
        data: { premiumLevel },
      })

      await logAudit({
        action: "PREMIUM_UPGRADE",
        details: `User ${user.name} upgraded to ${premiumLevel} tier (Payment Ref: ${reference})`,
        userId: user.id,
      })

      return NextResponse.redirect(
        buildReturnUrl(origin, returnTo, "/fundi/dashboard")
      )
    }

    if (purpose === "registration") {
      if (!userId) {
        return NextResponse.redirect(buildReturnUrl(origin, returnTo, "/"))
      }

      await db.fundiProfile.update({
        where: { userId },
        data: { isRegistrationPaid: true },
      })

      await logAudit({
        action: "REGISTRATION_PAYMENT",
        details: `User registration fee paid successfully (Payment Ref: ${reference})`,
        userId,
      })

      return NextResponse.redirect(
        buildReturnUrl(origin, returnTo, "/auth/login?registered=true")
      )
    }

    return NextResponse.redirect(buildReturnUrl(origin, returnTo, "/"))
  } catch (error) {
    console.error("Error handling payment callback:", error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}