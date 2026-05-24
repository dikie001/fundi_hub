import { ImageResponse } from "next/og"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export default function OpenGraphImage() {
  const logoUrl = new URL("/fundi_hub_logo.jpg", siteUrl).toString()

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "72px",
        color: "#f8fafc",
        background:
          "linear-gradient(135deg, #0f172a 0%, #111827 46%, #c2410c 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "680px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "112px",
              height: "112px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "28px",
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.08)",
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.35)",
            }}
          >
            <img
              src={logoUrl}
              alt="FundiHub logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                fontSize: "72px",
                lineHeight: "1",
                fontWeight: 800,
                letterSpacing: "-0.06em",
              }}
            >
              FundiHub
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "24px",
                color: "rgba(248, 250, 252, 0.86)",
              }}
            >
              <span>Built for fundis.</span>
              <span>Trusted by clients.</span>
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: "30px",
            lineHeight: "1.35",
            maxWidth: "620px",
            color: "rgba(248, 250, 252, 0.9)",
          }}
        >
          Help your fundi business grow with better visibility, stronger
          leads, and a trusted profile that clients can find across Kenya.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "16px 22px",
            borderRadius: "999px",
            background: "rgba(255, 255, 255, 0.12)",
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          Grow your client base in minutes
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "8px",
            fontSize: "22px",
            color: "rgba(248, 250, 252, 0.7)",
          }}
        >
          <span>FundiHub</span>
          <span>{siteUrl.replace("https://", "").replace("http://", "")}</span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  )
}
