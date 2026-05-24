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
import { TrendingUp, Users, Gift, Wallet } from "lucide-react"

export default function ReferEarnPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Refer & <span className="text-primary">Earn</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Earn Ksh 100 for every fundi you successfully refer to FundiHub
            </p>
          </div>

          {/* How it Works */}
          <div className="mt-16">
            <h2 className="mb-8 text-center text-2xl font-bold">
              How It Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <CardTitle className="mt-4">
                    Identify Skilled Workers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Find plumbers, electricians, painters, and other skilled
                    workers who could benefit from FundiHub
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <CardTitle className="mt-4">Share Your Link</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Share your unique referral link with them and help them sign
                    up on FundiHub
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <CardTitle className="mt-4">Get Paid</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Earn Ksh 100 for each successful referral when they complete
                    registration
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-16">
            <Card className="border-2 border-primary/20 bg-linear-to-r from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <TrendingUp className="text-primary" />
                  Why Join Our Referral Program?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex gap-3">
                    <Wallet className="h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold">Unlimited Earnings</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        No cap on how many fundis you can refer
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Users className="h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold">Help Your Community</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Connect skilled workers with more job opportunities
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Gift className="h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold">Easy Process</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Simple referral system with quick payments
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <TrendingUp className="h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold">Track Your Success</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Monitor your referrals and earnings in real-time
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Start Referring Now</Link>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
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
