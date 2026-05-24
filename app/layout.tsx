import "./globals.css"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FundiHub",
    template: "%s | FundiHub",
  },
  description:
    "FundiHub helps fundis grow their business, manage leads, and connect with clients, while giving clients a trusted way to find verified local experts.",
  applicationName: "FundiHub",
  authors: [{ name: "FundiHub" }],
  creator: "FundiHub",
  publisher: "FundiHub",
  keywords: [
    "FundiHub",
    "fundis",
    "local services",
    "handyman",
    "book experts",
    "Kenya services",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "FundiHub",
    title: "FundiHub",
    description:
      "FundiHub helps fundis grow their business, manage leads, and connect with clients, while giving clients a trusted way to find verified local experts.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "FundiHub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FundiHub",
    description:
      "FundiHub helps fundis grow their business, manage leads, and connect with clients, while giving clients a trusted way to find verified local experts.",
    images: ["/opengraph-image"],
  },
}

export const viewport: Viewport = {
  themeColor: "#c84f14",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{
        ["--font-sans" as string]:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        ["--font-mono" as string]:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
        ["--font-serif" as string]:
          'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      }}
      className="font-sans antialiased"
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
