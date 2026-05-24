"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Users, DollarSign, Briefcase } from "lucide-react"

export default function ForFundisPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Join FundiHub as a <span className="text-primary">Professional</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Grow your business by connecting with clients across Kenya
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Users className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Access More Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get discovered by thousands of clients looking for your skills
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Grow Your Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Increase your earnings with steady job opportunities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Briefcase className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Professional Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Showcase your work and build your professional reputation
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pricing */}
          <div className="mt-16">
            <h2 className="mb-8 text-center text-2xl font-bold">Simple Pricing</h2>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Registration Fee</CardTitle>
                  <CardDescription className="text-2xl font-bold text-primary">
                    Ksh 200
                  </CardDescription>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>Account creation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>Profile setup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>Instant activation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Monthly Subscription</CardTitle>
                  <CardDescription className="text-2xl font-bold text-primary">
                    Ksh 500/month
                  </CardDescription>
                  <p className="text-sm text-muted-foreground">Cancel anytime</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>Stay visible to clients</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>Unlimited job leads</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Join FundiHub Now</Link>
            </Button>
          </div>
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
