"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import {
  Target,
  Eye,
  Heart,
  Users,
  Shield,
  Zap,
  Award,
  TrendingUp,
  Mail,
  Phone,
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/5 to-transparent px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            About FundiHub
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Empowering Kenya's <span className="text-primary">Skilled Workforce</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            We're building the trusted bridge between skilled professionals and
            the clients who need them — one connection at a time.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border/60">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-3">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To digitally empower skilled workers across Kenya by giving
                  them a platform to showcase their expertise and connect with
                  clients who value quality craftsmanship.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-3">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To be Africa's most trusted platform for skilled services —
                  where every fundi has access to opportunity and every client
                  finds reliable, verified professionals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-3">Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Trust, transparency, and community. We believe in fair
                  pricing, verified profiles, and direct communication — no
                  middlemen, no hidden fees.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-muted/20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Our Story</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Built in Kenya, for Kenya
            </p>
          </div>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              FundiHub was born out of a simple frustration — finding a reliable
              fundi shouldn't feel like a gamble. Whether you needed a plumber
              for a leaking pipe or an electrician for urgent repairs, the
              process was always the same: ask friends, hope for the best, and
              cross your fingers.
            </p>
            <p>
              On the other side, talented fundis were struggling to find steady
              work. They had the skills, the dedication, and the experience —
              but no platform to showcase their craft to a wider audience.
            </p>
            <p>
              We built FundiHub to bridge that gap. A platform where verified
              professionals can build their reputation, and where clients can
              connect directly with skilled experts in their area. No
              middlemen. No inflated prices. Just real people doing great work.
            </p>
          </div>
        </div>
      </section>

      {/* Why FundiHub */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Why Choose FundiHub?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              What makes us different
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <Shield className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-semibold">Verified Profiles</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Every fundi is verified to ensure quality and accountability.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <Zap className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-semibold">Direct Connection</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Talk directly via WhatsApp or call. No middlemen, no delays.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <Award className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-semibold">Trusted Ratings</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Real reviews from real clients help you choose with confidence.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <TrendingUp className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-semibold">Fair Pricing</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Transparent pricing with no hidden charges or commissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-muted/20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Meet the Founder</h2>
          </div>
          <Card className="mt-8 border-border/60">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                  CO
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold">Calvince Ouma</h3>
                  <p className="text-sm text-primary">Founder & CEO</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    A Kenyan entrepreneur passionate about leveraging
                    technology to solve everyday problems. Calvince founded
                    FundiHub with a vision to empower skilled workers and make
                    quality services accessible to everyone.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                    <a
                      href="mailto:calvincewise@gmail.com"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      calvincewise@gmail.com
                    </a>
                    <a
                      href="tel:+254799112919"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      +254 799 112 919
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/10 via-primary/5 to-transparent">
            <CardContent className="p-8 text-center sm:p-12">
              <Users className="mx-auto h-10 w-10 text-primary" />
              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                Join thousands of Kenyans using FundiHub to find skilled
                professionals or grow their business.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">Create Account</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Compact Footer */}
      <footer className="mt-auto border-t border-border bg-muted/30 px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          © 2026 FundiHub. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
