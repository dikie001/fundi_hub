"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Printer, Link2, Check, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const sections = [
  { id: "introduction", title: "1. Introduction & Overview" },
  { id: "collection", title: "2. Information We Collect" },
  { id: "usage", title: "3. How We Use Your Data" },
  { id: "sharing", title: "4. Sharing & Disclosure" },
  { id: "cookies", title: "5. Cookies & Tracking" },
  { id: "security", title: "6. Security & Data Retention" },
  { id: "rights", title: "7. Your Rights & Choices" },
  { id: "changes", title: "8. Changes to this Policy" },
  { id: "contact", title: "9. Contact Us" },
]

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Trigger when section is in the middle of the viewport
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    sections.forEach((section) => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })

    return () => {
      sections.forEach((section) => {
        const el = document.getElementById(section.id)
        if (el) observer.unobserve(el)
      })
    }
  }, [])

  const copyLink = (id: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}#${id}`
      navigator.clipboard.writeText(url).then(() => {
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
      })
    }
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary print:bg-white print:text-black">
      {/* Top Header Row - Minimal, Clean */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 print:hidden">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 rounded-lg hover:bg-muted"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                <span className="sr-only">Back to Home</span>
              </Link>
            </Button>
            <div className="h-4 w-px bg-border/60" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-medium hover:text-foreground">
                <Link href="/">FundiHub</Link>
              </span>
              <span>/</span>
              <span className="text-foreground font-semibold">Privacy Policy</span>
            </div>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 gap-1.5 px-3 text-xs border-border/60 hover:bg-muted font-medium rounded-lg"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Simple Page Title (No huge bloated header banner) */}
        <div className="mb-10 pb-6 border-b border-border/30 max-w-4xl">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase mb-2">
            <ShieldCheck className="h-4 w-4" />
            Legal Agreement
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span>Last updated: May 24, 2026</span>
            <span className="hidden sm:inline">•</span>
            <span>Effective Date: May 24, 2026</span>
            <span className="hidden sm:inline">•</span>
            <span>Applies to all FundiHub users</span>
          </div>
        </div>

        {/* Two-column layout: TOC on left, Content on right */}
        <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
          {/* Table of Contents Sidebar (sticky) */}
          <aside className="hidden lg:block print:hidden">
            <div className="sticky top-20 space-y-6">
              <div>
                <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-4">
                  On this page
                </h2>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`block text-xs font-medium py-2 border-l pl-3 -ml-px transition-colors duration-200 ${
                        activeSection === section.id
                          ? "border-primary text-primary font-semibold"
                          : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                      }`}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Policy Document content */}
          <article className="prose prose-sm max-w-3xl leading-relaxed text-muted-foreground space-y-8 select-text">
            {/* Section 1: Introduction & Overview */}
            <section id="introduction" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  1. Introduction & Overview
                </h2>
                <button
                  onClick={() => copyLink("introduction")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "introduction" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                Welcome to FundiHub (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We respect your privacy and are committed to protecting your personal data. This Privacy Policy describes how we collect, use, store, process, and disclose your personal information when you use our website, mobile applications, and services (collectively, the &quot;Platform&quot;).
              </p>
              <p className="text-sm mt-3">
                FundiHub functions as a marketplace platform designed to connect clients seeking local services (&quot;Clients&quot;) with skilled local tradespeople, service providers, and handymen (&quot;Fundis&quot;). By accessing or using our Platform, you consent to the collection and use of your data as outlined in this Privacy Policy.
              </p>
            </section>

            {/* Section 2: Information We Collect */}
            <section id="collection" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  2. Information We Collect
                </h2>
                <button
                  onClick={() => copyLink("collection")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "collection" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                We collect personal information that you voluntarily provide to us, as well as data that is generated automatically when you interact with the Platform.
              </p>
              
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mt-4 mb-2">A. Information You Provide</h3>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>
                  <strong className="text-foreground/90">Account Information:</strong> When you register on our Platform, we collect basic details such as your name, email address, phone number, physical address, and password.
                </li>
                <li>
                  <strong className="text-foreground/90">Fundi Profiles:</strong> If you register as a Fundi, we collect additional details including your specific trade or skill, experience, work portfolio (including images of completed works), licensing or certifications, service rates, and profile photographs.
                </li>
                <li>
                  <strong className="text-foreground/90">Client Bookings & Support:</strong> We collect data you submit during bookings, inquiries, and communication with Fundis or our customer support team.
                </li>
                <li>
                  <strong className="text-foreground/90">Payment Details:</strong> Any financial transactions on the platform are handled securely through third-party payment processors. We do not store raw card numbers on our servers; however, we receive transaction identifiers and basic status updates.
                </li>
              </ul>

              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mt-4 mb-2">B. Information Collected Automatically</h3>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>
                  <strong className="text-foreground/90">Usage Data:</strong> We track statistics on page views, interaction details, search queries, booking history, and system response times.
                </li>
                <li>
                  <strong className="text-foreground/90">Device & Connection Details:</strong> We collect your IP address, browser type, device identifiers, and operating system details to ensure security and site optimization.
                </li>
                <li>
                  <strong className="text-foreground/90">Location Data:</strong> To help match Clients with nearby Fundis, we collect approximate location data based on your IP address, or precise location data with your explicit mobile/web browser permission.
                </li>
              </ul>
            </section>

            {/* Section 3: How We Use Your Data */}
            <section id="usage" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  3. How We Use Your Data
                </h2>
                <button
                  onClick={() => copyLink("usage")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "usage" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                We process your personal information for a variety of business purposes, focusing on creating a seamless and secure local hiring ecosystem.
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2 text-xs">
                <li>
                  <strong className="text-foreground/90">Platform Operation:</strong> Facilitating bookings, matches, referrals, and managing communications between Clients and Fundis.
                </li>
                <li>
                  <strong className="text-foreground/90">Profile Visibility:</strong> Displaying public profiles, skill portfolios, reviews, and client ratings on search pages for Fundis.
                </li>
                <li>
                  <strong className="text-foreground/90">Notifications:</strong> Sending booking confirmations, structural updates, transaction details, and system alerts via email or SMS.
                </li>
                <li>
                  <strong className="text-foreground/90">Security & Protection:</strong> Monitoring and preventing unauthorized access, abuse, spam, fraud, or violations of our Terms of Service.
                </li>
                <li>
                  <strong className="text-foreground/90">Analytics & Personalization:</strong> Analyzing usage metrics to optimize layouts, search filters, and add features that improve service delivery.
                </li>
              </ul>
            </section>

            {/* Section 4: Sharing & Disclosure */}
            <section id="sharing" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  4. Sharing & Disclosure
                </h2>
                <button
                  onClick={() => copyLink("sharing")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "sharing" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                We do not sell, rent, or trade your personal data. We disclose your information only in specific circumstances:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2 text-xs">
                <li>
                  <strong className="text-foreground/90">With Other Platform Users:</strong> To facilitate service delivery, we share relevant contact information (such as telephone number or location) between a Client and their selected Fundi once a booking is confirmed.
                </li>
                <li>
                  <strong className="text-foreground/90">Third-Party Service Providers:</strong> We employ trusted external companies to handle functions on our behalf, including hosting (Vercel, AWS), database services (Prisma, PostgreSQL providers), payment integration (Paystack), and analytics. These providers only access data necessary to perform their services and are contractually bound to confidentiality.
                </li>
                <li>
                  <strong className="text-foreground/90">Legal Compliance & Security:</strong> We may share data when requested under valid judicial summonses, local law regulations, or if we deem it necessary to protect the safety of users, the public, or FundiHub systems.
                </li>
              </ul>
            </section>

            {/* Section 5: Cookies & Tracking */}
            <section id="cookies" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  5. Cookies & Tracking
                </h2>
                <button
                  onClick={() => copyLink("cookies")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "cookies" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                We use cookies and similar tracking technologies (like local storage) to keep you signed in, understand your navigation patterns, and remember your platform preferences.
              </p>
              <p className="text-sm mt-3">
                Most web browsers automatically accept cookies, but you can adjust your browser settings to reject them. Please note that disabling cookies may impact your ability to use certain core functions of the FundiHub Platform.
              </p>
            </section>

            {/* Section 6: Security & Data Retention */}
            <section id="security" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  6. Security & Data Retention
                </h2>
                <button
                  onClick={() => copyLink("security")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "security" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                We implement industry-standard physical, electronic, and administrative safeguards to protect your personal details from unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p className="text-sm mt-3">
                We retain your personal data for as long as your account remains active or as required to fulfill the business objectives outlined in this policy. If you choose to delete your account, we will erase or anonymize your data, except where we must retain certain details to comply with legal, tax, or regulatory obligations.
              </p>
            </section>

            {/* Section 7: Your Rights & Choices */}
            <section id="rights" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  7. Your Rights & Choices
                </h2>
                <button
                  onClick={() => copyLink("rights")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "rights" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                Depending on your jurisdiction, you may have rights regarding your personal information. These typically include:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2 text-xs">
                <li>
                  <strong className="text-foreground/90">Access and Correction:</strong> You can view and edit your profile details anytime by logging into your account dashboard.
                </li>
                <li>
                  <strong className="text-foreground/90">Data Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request the deletion of your account and personal details by contacting our support team.
                </li>
                <li>
                  <strong className="text-foreground/90">Marketing Opt-Out:</strong> You can unsubscribe from non-essential promotional emails by clicking the link at the bottom of our emails.
                </li>
              </ul>
            </section>

            {/* Section 8: Changes to this Policy */}
            <section id="changes" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  8. Changes to this Policy
                </h2>
                <button
                  onClick={() => copyLink("changes")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "changes" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                We may revise this Privacy Policy periodically to reflect shifts in our practices, platform upgrades, or legal changes. When updates are published, we will adjust the &quot;Last updated&quot; date at the top of this page. We encourage you to review this policy periodically to stay informed about how we safeguard your data.
              </p>
            </section>

            {/* Section 9: Contact Us */}
            <section id="contact" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  9. Contact Us
                </h2>
                <button
                  onClick={() => copyLink("contact")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "contact" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                If you have questions, comments, or concerns regarding this Privacy Policy, or if you would like to exercise any of your data rights, please reach out to us at:
              </p>
              <div className="mt-3 p-4 rounded-xl border border-border/40 bg-muted/30 text-xs space-y-1 max-w-md">
                <p className="font-semibold text-foreground">FundiHub Privacy Team</p>
                <p>Email: <a href="mailto:support@fundihub.com" className="text-primary hover:underline">support@fundihub.com</a></p>
                <p>Support Portal: <Link href="/support" className="text-primary hover:underline">fundihub.com/support</Link></p>
              </div>
            </section>
          </article>
        </div>
      </div>
    </main>
  )
}
