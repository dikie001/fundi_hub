import { ImageResponse } from "next/og"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export default function AppleIcon() {
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
          borderRadius: "28px",
          background: "#f8fafc",
          overflow: "hidden",
          boxShadow: "inset 0 0 0 6px rgba(194, 65, 12, 0.12)",
        }}
      >
        <img
          src={logoUrl}
          alt="FundiHub logo"
          style={{
            width: "76%",
            height: "76%",
            objectFit: "cover",
            borderRadius: "22px",
          }}
        />
      </div>
    ),
    {
      width: 180,
      height: 180,
    }
  )
}