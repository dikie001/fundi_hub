"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Users, DollarSign, Gift, Share2 } from "lucide-react"

type ReferralsTabProps = {
  user: any
  referralCount: number
  referralEarnings: number
  copyReferralLink: () => void
  copiedReferral: boolean
}

export function ReferralsTab({
  user,
  referralCount,
  referralEarnings,
  copyReferralLink,
  copiedReferral,
}: ReferralsTabProps) {
  const referralLink =
    user && typeof window !== "undefined"
      ? `${window.location.origin}/auth/signup?ref=${user.id}`
      : ""

  return (
    <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-xl font-extrabold text-foreground">Referrals & Rewards</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Monitor your invite lists, copy registration links, and track your wallet payout statistics.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card className="border border-border/60 bg-card transition-all hover:border-primary/20 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs font-black tracking-wider text-muted-foreground uppercase">
              <Users className="h-4 w-4 text-primary" /> Total Invites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-foreground">{referralCount}</span>
              <span className="text-xs text-muted-foreground">partners registered</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Keep sharing your link to earn more rewards!</p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card transition-all hover:border-primary/20 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs font-black tracking-wider text-muted-foreground uppercase">
              <DollarSign className="h-4 w-4 text-primary" /> Referral Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-foreground">KES {referralEarnings.toLocaleString()}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">KES 100 earned per successful signup.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border/40 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Share2 className="h-4 w-4 text-primary" /> Invite New Partners
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Copy and send your custom referral link to other fundis. When they sign up, you will earn KES 100 instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="min-w-0 flex-1 rounded-lg border border-border/40 bg-muted/60 p-2.5 font-mono text-xs text-muted-foreground outline-hidden select-all"
            />
            <Button
              size="sm"
              onClick={copyReferralLink}
              className="h-9 shrink-0 cursor-pointer rounded-lg px-4 text-xs font-bold"
            >
              {copiedReferral ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/40 bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Gift className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Payout Terms</h3>
            <p className="mt-1 text-xs leading-normal text-muted-foreground">
              Earnings are credited directly to your partner wallet. Withdrawals are processed weekly on Friday afternoons
              via M-Pesa to your registered phone number. Minimum payout threshold is KES 500.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
