import { ImageResponse } from "next/og"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export default function Icon() {
  const logoUrl = new URL("/fundi_hub_logo.jpg", siteUrl).toString()

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "24px",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 30% 30%, #f97316 0%, #c2410c 50%, #111827 100%)",
        }}
      >
        <img
          src={logoUrl}
          alt="FundiHub logo"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    ),
    {
      width: 32,
      height: 32,
    }
  )
}