"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, DollarSign, TrendingUp, Eye, Shield, Zap, Clock, MessageCircle, Phone, Star } from "lucide-react"
import Link from "next/link"

export default function ForFundisPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="mb-6 flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold">Join FundiHub</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Get online visibility, verified digital profiles, and direct client communication
          </p>
        </div>
      </section>

      {/* Why Join */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold">Why Join FundiHub?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Eye className="mb-4 h-8 w-8 text-primary" />
                <CardTitle>Online Visibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get discovered by clients actively searching for your services across Kenya and Africa.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="mb-4 h-8 w-8 text-primary" />
                <CardTitle>Verified Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Build trust with clients through verified digital profiles and genuine ratings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageCircle className="mb-4 h-8 w-8 text-primary" />
                <CardTitle>Direct Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with clients via WhatsApp and phone calls - no middleman involved.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="mb-4 h-8 w-8 text-primary" />
                <CardTitle>More Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access more job leads and expand your client base continuously.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Star className="mb-4 h-8 w-8 text-primary" />
                <CardTitle>Reputation Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Build your professional reputation through client reviews and ratings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="mb-4 h-8 w-8 text-primary" />
                <CardTitle>Affordable Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simple, transparent fees with no hidden charges or complicated structures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-3xl font-bold">Membership Plans</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Flexible pricing to help you grow your business
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Registration Fee */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">One-Time Registration</CardTitle>
                <div className="mt-2 space-y-1">
                  <p className="text-4xl font-bold text-primary">Ksh 200</p>
                  <CardDescription>One-time only</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Includes:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Account creation
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Profile setup
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Listing activation
                    </li>
                  </ul>
                </div>
                <Button className="w-full">Register Now</Button>
              </CardContent>
            </Card>

            {/* Monthly Subscription */}
            <Card className="border-2 border-primary">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Monthly Subscription</CardTitle>
                  <Badge>POPULAR</Badge>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-4xl font-bold text-primary">Ksh 500</p>
                  <CardDescription>Per month</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Active profile
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Searchable listing
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Job leads
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Client messaging
                    </li>
                  </ul>
                </div>
                <Button className="w-full">Subscribe Now</Button>
              </CardContent>
            </Card>

            {/* Premium Badges */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Premium Badges</CardTitle>
                <CardDescription>Boost your visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="flex items-center gap-2 font-medium">
                      <Badge className="bg-blue-600 hover:bg-blue-700">✓</Badge>
                      Verified Badge
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">Ksh 300/month</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Verified trust badge for credibility
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="flex items-center gap-2 font-medium">
                      <Badge className="bg-amber-600 hover:bg-amber-700">⭐</Badge>
                      Top & Verified
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">Ksh 500/month</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Premium visibility + top search ranking
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Profile Features */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold">Your FundiHub Profile Includes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  WhatsApp Button
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Clients can instantly reach you via WhatsApp to request quotations, send photos/videos, and negotiate directly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Call Button
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Clients can call you directly to discuss urgent repairs, confirm availability, and request emergency services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Rating & Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Build your reputation as clients leave reviews and ratings based on their experience with you.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Showcase your work with photos and descriptions to attract more qualified clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold">Getting Started</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader>
                <Badge className="w-fit">Step 1</Badge>
                <CardTitle className="mt-3">Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create your account with basic information and pay Ksh 200 registration fee.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge className="w-fit">Step 2</Badge>
                <CardTitle className="mt-3">Build Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add your expertise, experience, services offered, and photos to your profile.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge className="w-fit">Step 3</Badge>
                <CardTitle className="mt-3">Go Live</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Subscribe to monthly plan (Ksh 500) to activate listing and appear in search results.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge className="w-fit">Step 4</Badge>
                <CardTitle className="mt-3">Get Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Start receiving job leads from clients and grow your business through the platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="border-2 border-primary bg-gradient-to-r from-primary/10 to-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Ready to Grow Your Business?</CardTitle>
              <CardDescription className="mt-2 text-base">
                Join thousands of fundis getting more clients through FundiHub
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="min-w-40">
                Join FundiHub
              </Button>
              <Button size="lg" variant="outline" asChild className="min-w-40">
                <a href="tel:+254799112919">Call for Support</a>
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 rounded-lg border border-border bg-muted/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Questions? Contact us at{" "}
              <a href="mailto:calvincewise@gmail.com" className="font-medium text-primary hover:underline">
                calvincewise@gmail.com
              </a>{" "}
              or call{" "}
              <a href="tel:+254799112919" className="font-medium text-primary hover:underline">
                +254799112919
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
