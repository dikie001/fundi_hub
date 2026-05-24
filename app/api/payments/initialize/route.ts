import { NextRequest, NextResponse } from "next/server"

function buildCallbackUrl(
  origin: string,
  callbackPath: string,
  callbackParams?: Record<string, string>
) {
  if (!callbackPath.startsWith("/")) {
    throw new Error("Callback path must be a relative path")
  }

  const callbackUrl = new URL(callbackPath, origin)

  if (callbackParams) {
    for (const [key, value] of Object.entries(callbackParams)) {
      callbackUrl.searchParams.set(key, value)
    }
  }

  return callbackUrl.toString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, email, name, phone, callbackPath, callbackParams } = body

    if (!amount || !email || !callbackPath) {
      return NextResponse.json(
        { error: "Amount, email, and callback path are required" },
        { status: 400 }
      )
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY not configured")
      return NextResponse.json(
        { error: "Payment configuration error" },
        { status: 500 }
      )
    }

    const reference = `fh_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    const callbackUrl = buildCallbackUrl(
      request.nextUrl.origin,
      String(callbackPath),
      callbackParams
    )

    const initializeResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Number(amount) * 100,
          reference,
          callback_url: callbackUrl,
          currency: "KES",
          metadata: {
            custom_fields: [
              {
                display_name: "Name",
                variable_name: "name",
                value: name || "",
              },
              {
                display_name: "Phone",
                variable_name: "phone",
                value: phone || "",
              },
            ],
          },
        }),
      }
    )

    const initializeData = await initializeResponse.json()

    if (!initializeResponse.ok || !initializeData.status) {
      return NextResponse.json(
        {
          error:
            initializeData.message ||
            "Unable to initialize Paystack checkout",
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: initializeData.data?.authorization_url,
      reference: initializeData.data?.reference || reference,
    })
  } catch (error) {
    console.error("Error initializing payment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}