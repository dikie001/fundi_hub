"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"

type MembershipTabProps = {
  profile: any
  openPremiumModal: (type: "verified" | "top") => void
}

export function MembershipTab({ profile, openPremiumModal }: MembershipTabProps) {
  const currentLevel = profile?.premiumLevel || "none"

  const tiers = [
    {
      id: "top",
      title: "Premium Partner Badge",
      price: "Ksh 500 / mo",
      icon: Sparkles,
      colorClass: "text-amber-500",
      bgClass: "bg-amber-500/10 border-amber-500/20",
      description: "Get verified immediately, rise to the top of search rankings, and secure 5x more customer leads.",
      features: [
        "Gold Premium Partner badge on your profile & search card",
        "Always featured at the top of category browse results",
        "5x priority dispatch queue for incoming client matches",
        "Exclusive 'Verified Expert' trust tick credential verification",
        "Direct call & WhatsApp action buttons enabled on your cards",
      ],
      isActive: currentLevel === "top" || currentLevel === "verified",
      isCurrent: currentLevel === "top" || currentLevel === "verified",
      buttonText: currentLevel === "top" || currentLevel === "verified" ? "Active" : "Activate Premium Badge",
    },
  ]

  return (
    <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-xl font-extrabold text-foreground">Membership & Premium Boost</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Upgrade your profile to build massive customer trust and listing priority.
        </p>
      </div>

      <div className="max-w-md mx-auto pt-4">
        {tiers.map((tier) => {
          const Icon = tier.icon
          return (
            <Card
              key={tier.id}
              className={`relative overflow-hidden flex flex-col justify-between border-2 bg-gradient-to-b from-amber-500/10 via-card to-card transition-all duration-300 shadow-xl ${
                tier.isCurrent 
                  ? "border-amber-500/80 ring-2 ring-amber-500/20" 
                  : "border-amber-500/30 hover:border-amber-500/60 hover:shadow-amber-500/5"
              }`}
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-amber-500/20 blur-xl pointer-events-none" />
              <div>
                <CardHeader className="border-b border-border/30 bg-muted/10 px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${tier.colorClass} animate-pulse`} />
                        <CardTitle className="text-base font-bold text-foreground">{tier.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs text-muted-foreground mt-1">{tier.description}</CardDescription>
                    </div>
                    {tier.isCurrent && (
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-black text-amber-500 uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 px-6 py-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-foreground">{tier.price}</span>
                  </div>

                  <ul className="space-y-3 text-xs text-muted-foreground">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <Check className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>
              <CardFooter className="border-t border-border/25 bg-muted/10 px-6 py-4">
                <Button
                  onClick={() => !tier.isActive && openPremiumModal(tier.id as any)}
                  disabled={tier.isActive}
                  className={`w-full h-11 rounded-xl text-xs font-bold transition-all border-none ${
                    tier.isActive
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/10 cursor-pointer hover:scale-[1.01]"
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
