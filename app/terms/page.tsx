"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Printer, Link2, Check, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

const sections = [
  { id: "acceptance", title: "1. Acceptance & Eligibility" },
  { id: "services", title: "2. Platform Services" },
  { id: "accounts", title: "3. Accounts & Verification" },
  { id: "conduct", title: "4. User Code of Conduct" },
  { id: "bookings", title: "5. Bookings & Payments" },
  { id: "contractors", title: "6. Independent Contractor Status" },
  { id: "liability", title: "7. Limits of Liability" },
  { id: "termination", title: "8. Account Termination" },
  { id: "disputes", title: "9. Governing Law & Disputes" },
  { id: "contact", title: "10. Updates & Contact Info" },
]

export default function TermsPage() {
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
              <span className="text-foreground font-semibold">Terms of Service</span>
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
            <FileText className="h-4 w-4" />
            Platform Agreement
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Terms of Service
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span>Last updated: May 24, 2026</span>
            <span className="hidden sm:inline">•</span>
            <span>Effective Date: May 24, 2026</span>
            <span className="hidden sm:inline">•</span>
            <span>Applies to Clients & Fundis</span>
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
            {/* Section 1: Acceptance & Eligibility */}
            <section id="acceptance" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  1. Acceptance & Eligibility
                </h2>
                <button
                  onClick={() => copyLink("acceptance")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "acceptance" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                By creating an account, browsing, or using the FundiHub platform, you agree to comply with and be bound by these Terms of Service (&quot;Terms&quot;) and our Privacy Policy. If you do not agree to these Terms, you must immediately cease using the platform.
              </p>
              <p className="text-sm mt-3">
                You must be at least 18 years of age and possess the legal capacity to enter into binding agreements under applicable local laws. If you are registering an account on behalf of a business entity or corporate body, you certify that you have the requisite authority to bind that entity to these Terms.
              </p>
            </section>

            {/* Section 2: Platform Services */}
            <section id="services" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  2. Platform Services
                </h2>
                <button
                  onClick={() => copyLink("services")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "services" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                FundiHub provides an online marketplace platform that facilitates connection and matching services between individuals or businesses seeking local technical, handyman, or trade services (&quot;Clients&quot;) and independent local service providers, handymen, or skilled tradespeople (&quot;Fundis&quot;).
              </p>
              <p className="text-sm mt-3 font-semibold text-foreground">
                Crucial Disclaimer: FundiHub itself is not a general contractor, service provider, employer, or agency. Fundis listed on the platform are fully independent contractors and are not employees, agents, or joint-venturers of FundiHub.
              </p>
            </section>

            {/* Section 3: Accounts & Verification */}
            <section id="accounts" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  3. Accounts & Verification
                </h2>
                <button
                  onClick={() => copyLink("accounts")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "accounts" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                To access core features of the platform, you must create a user profile. You agree to provide accurate, complete, and updated information during registration.
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2 text-xs">
                <li>
                  <strong className="text-foreground/90">Profile Credentials:</strong> You are solely responsible for keeping your login credentials confidential and secure. You must notify us immediately if you suspect unauthorized access.
                </li>
                <li>
                  <strong className="text-foreground/90">Identity and Skill Profiles:</strong> Fundis may be required to complete verification checks (e.g., telephone verification, identity documentation, licensing checks). While we implement security screening tools, FundiHub does not guarantee the complete accuracy of any user&apos;s identity or qualifications. Clients are encouraged to perform their own due diligence before hiring.
                </li>
              </ul>
            </section>

            {/* Section 4: User Code of Conduct */}
            <section id="conduct" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  4. User Code of Conduct
                </h2>
                <button
                  onClick={() => copyLink("conduct")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "conduct" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                All users agree to act in a professional, honest, and respectful manner. You must not:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2 text-xs">
                <li>
                  Upload defamatory, unlawful, harassing, or false content.
                </li>
                <li>
                  Circumvent our platform fee structure or matchmaking systems by arranging off-platform transactions to avoid platform protections.
                </li>
                <li>
                  Impersonate other users, or misrepresent your qualifications, licenses, or rates.
                </li>
                <li>
                  Use bots, scrapers, indexers, or malicious code designed to degrade, extract data, or compromise platform integrity.
                </li>
              </ul>
            </section>

            {/* Section 5: Bookings & Payments */}
            <section id="bookings" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  5. Bookings & Payments
                </h2>
                <button
                  onClick={() => copyLink("bookings")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "bookings" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                When a Client hires a Fundi through the Platform:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2 text-xs">
                <li>
                  <strong className="text-foreground/90">Service Contract:</strong> A separate contract is formed directly between the Client and the Fundi. FundiHub is not a party to that service contract.
                </li>
                <li>
                  <strong className="text-foreground/90">Payment Processing:</strong> Payments may be handled using integrated secure payment processing providers (e.g. Paystack). You authorize our processors to charge your selected payment method.
                </li>
                <li>
                  <strong className="text-foreground/90">Disputes & Refunds:</strong> Any payment dispute or refund requests regarding work quality should be initiated first between the Client and the Fundi. FundiHub may assist in dispute mediation at its sole discretion, but is not legally responsible for resolving or executing refunds.
                </li>
              </ul>
            </section>

            {/* Section 6: Independent Contractor Status */}
            <section id="contractors" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  6. Independent Contractor Status
                </h2>
                <button
                  onClick={() => copyLink("contractors")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "contractors" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                Fundis are fully independent local business owners. They decide their own schedules, working conditions, and equipment. They are solely responsible for local tax registrations, insurance compliance, professional liability, and adhering to municipal or national safety codes. FundiHub does not issue tax documents (e.g. W-2 / employee returns) for service earnings.
              </p>
            </section>

            {/* Section 7: Limits of Liability */}
            <section id="liability" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  7. Limits of Liability
                </h2>
                <button
                  onClick={() => copyLink("liability")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "liability" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm font-semibold text-foreground uppercase tracking-wider text-xs">
                To the maximum extent permitted by law, FundiHub provides the Platform &quot;as is&quot; and &quot;as available&quot; without warranties of any kind.
              </p>
              <p className="text-sm mt-3">
                FundiHub will not be liable for any direct, indirect, incidental, special, or consequential damages resulting from:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-xs">
                <li>
                  Your reliance on profiles, ratings, reviews, or project descriptions listed on the site.
                </li>
                <li>
                  Conduct, performance, safety issues, property damages, or service failures arising from jobs executed by Fundis hired on the Platform.
                </li>
                <li>
                  Platform interruptions, outages, data loss, or server down-times.
                </li>
              </ul>
            </section>

            {/* Section 8: Account Termination */}
            <section id="termination" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  8. Account Termination
                </h2>
                <button
                  onClick={() => copyLink("termination")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "termination" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                We reserve the right to suspend or terminate your account and restrict your access to the Platform immediately, without prior notice, if you violate these Terms, breach our code of conduct, or engage in behavior that we deem harmful to other users or our platform business.
              </p>
              <p className="text-sm mt-3">
                You may close your account at any time via your user dashboard settings or by sending an request to our support team.
              </p>
            </section>

            {/* Section 9: Governing Law & Disputes */}
            <section id="disputes" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  9. Governing Law & Disputes
                </h2>
                <button
                  onClick={() => copyLink("disputes")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary rounded"
                  title="Copy link to this section"
                >
                  {copiedId === "disputes" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm">
                These Terms and your use of the Platform shall be governed by and construed in accordance with local national laws, without regard to conflict of law principles.
              </p>
              <p className="text-sm mt-3">
                Any legal claim or dispute arising in connection with the Platform must be resolved through binding arbitration or before a competent local court, as mandated by regional regulations.
              </p>
            </section>

            {/* Section 10: Updates & Contact Info */}
            <section id="contact" className="scroll-mt-24 group">
              <div className="flex items-center gap-2 border-b border-border/20 pb-2 mb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight m-0">
                  10. Updates & Contact Info
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
                We may revise these Terms of Service from time to time. When we make updates, we will update the &quot;Last updated&quot; timestamp at the top of this page. Your continued use of the platform following the publication of changes signifies your acceptance of the updated terms.
              </p>
              <p className="text-sm mt-3">
                If you have questions, feedback, or need clarification regarding these Terms of Service, please contact us at:
              </p>
              <div className="mt-3 p-4 rounded-xl border border-border/40 bg-muted/30 text-xs space-y-1 max-w-md">
                <p className="font-semibold text-foreground">FundiHub Operations Team</p>
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
