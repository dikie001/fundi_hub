import "./globals.css"
import type { Metadata } from "next"
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
    "Find trusted local fundis, compare reviews, and book verified service professionals on FundiHub.",
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
  themeColor: "#c84f14",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "FundiHub",
    title: "FundiHub",
    description:
      "Find trusted local fundis, compare reviews, and book verified service professionals on FundiHub.",
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
      "Find trusted local fundis, compare reviews, and book verified service professionals on FundiHub.",
    images: ["/opengraph-image"],
  },
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
      className="antialiased font-sans"
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
