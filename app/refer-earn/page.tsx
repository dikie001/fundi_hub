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
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Zap, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function ReferEarnPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-6 flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold">Refer & Earn Program</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Earn Ksh 100 for every fundi you refer to FundiHub
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Step 1</CardTitle>
                    <CardDescription>Refer a Fundi</CardDescription>
                  </div>
                  <Badge variant="default" className="text-base">
                    1
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Share FundiHub with skilled workers you know
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Step 2</CardTitle>
                    <CardDescription>They Register</CardDescription>
                  </div>
                  <Badge variant="default" className="text-base">
                    2
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Fundi creates account and sets up profile
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Step 3</CardTitle>
                    <CardDescription>They Pay Fee</CardDescription>
                  </div>
                  <Badge variant="default" className="text-base">
                    3
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Fundi pays Ksh 200 registration fee
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Step 4</CardTitle>
                    <CardDescription>You Earn!</CardDescription>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-green-600 text-base hover:bg-green-700"
                  >
                    💰
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Receive Ksh 100 commission automatically
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold">Why Participate?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Zap className="mb-4 h-8 w-8 text-yellow-500" />
                <CardTitle>Easy & Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Simply share with people you know. No complex process.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="mb-4 h-8 w-8 text-blue-500" />
                <CardTitle>Unlimited Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Earn for every successful referral. No limit on commissions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="mb-4 h-8 w-8 text-purple-500" />
                <CardTitle>Community Building</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Help skilled workers get more visibility and opportunities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="mb-4 h-8 w-8 text-green-500" />
                <CardTitle>Automatic Payout</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Commissions processed automatically after registration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who Can Participate */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold">Who Can Refer?</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="grid gap-4 sm:grid-cols-2">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                  <span>Students</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                  <span>Agents & Mobilizers</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                  <span>Influencers</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                  <span>Existing Fundis</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                  <span>Anyone with connections</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Earnings Example */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold">Earnings Potential</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl">10 Referrals</CardTitle>
                <CardDescription>Per month</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">Ksh 1,000</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  10 × Ksh 100
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10">
              <CardHeader>
                <CardTitle className="text-2xl">50 Referrals</CardTitle>
                <CardDescription>Per month</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">Ksh 5,000</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  50 × Ksh 100
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10">
              <CardHeader>
                <CardTitle className="text-2xl">100 Referrals</CardTitle>
                <CardDescription>Per month</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">Ksh 10,000</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  100 × Ksh 100
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
              <CardTitle className="text-3xl">
                Ready to Start Earning?
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                Share FundiHub with skilled workers you know and earn
                commissions
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4">
              <Button size="lg">Start Referring</Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+254799112919">Contact for Support</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
