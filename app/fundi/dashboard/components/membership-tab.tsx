"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ShieldCheck } from "lucide-react"
import type { FundiProfileData } from "@/lib/types"

type MembershipTabProps = {
  profile: FundiProfileData | null
  openPremiumModal: () => void
}

export function MembershipTab({
  profile,
  openPremiumModal,
}: MembershipTabProps) {
  const isPremium = profile?.isPremium ?? false

  const tiers = [
    {
      id: "premium",
      title: "Premium Badge",
      price: "Ksh 500 once",
      icon: ShieldCheck,
      colorClass: "text-primary",
      description:
        "Get verified immediately, rise to the top of search rankings, and secure 5x more customer leads.",
      features: [
        "Premium badge display on your profile and search cards",
        "Display priority at the top of category browse results",
        "5x matching priority for incoming client leads",
        "Verified Expert credentials tick mark",
        "Enable direct call and WhatsApp buttons on your cards",
      ],
      isActive: isPremium,
      isCurrent: isPremium,
      buttonText: isPremium ? "Active" : "Activate Premium Badge",
    },
  ]

  return (
    <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-xl font-extrabold text-foreground">
          Membership Benefits
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Upgrade your profile to build customer trust and listing priority.
        </p>
      </div>

      <div className="mx-auto max-w-md pt-4">
        {tiers.map((tier) => {
          const Icon = tier.icon
          return (
            <Card
              key={tier.id}
              className={`flex flex-col justify-between border border-border bg-card shadow-sm transition-all duration-300 ${
                tier.isCurrent
                  ? "border-primary ring-1 ring-primary"
                  : "hover:border-primary/20"
              }`}
            >
              <div>
                <CardHeader className="border-b border-border/30 bg-muted/10 px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${tier.colorClass}`} />
                        <CardTitle className="text-base font-bold text-foreground">
                          {tier.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="mt-1 text-xs text-muted-foreground">
                        {tier.description}
                      </CardDescription>
                    </div>
                    {tier.isCurrent && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-primary uppercase">
                        Active
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 px-6 py-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-foreground">
                      {tier.price}
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs text-muted-foreground">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>
              <CardFooter className="border-t border-border/25 bg-muted/10 px-6 py-4">
                <Button
                  onClick={() => !tier.isActive && openPremiumModal()}
                  disabled={tier.isActive}
                  className={`h-11 w-full rounded-xl text-xs font-bold transition-all ${
                    tier.isActive
                      ? "cursor-not-allowed bg-muted text-muted-foreground"
                      : "cursor-pointer"
                  }`}
                >
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
