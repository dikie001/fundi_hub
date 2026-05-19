"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Zap, Check } from "lucide-react"

type MembershipTabProps = {
  profile: any
  openPremiumModal: (type: "verified" | "top") => void
}

export function MembershipTab({ profile, openPremiumModal }: MembershipTabProps) {
  const currentLevel = profile?.premiumLevel || "none"

  const tiers = [
    {
      id: "verified",
      title: "Verified Badge",
      price: "Ksh 300 / mo",
      icon: ShieldCheck,
      colorClass: "text-blue-500",
      bgClass: "bg-blue-500/10 border-blue-500/20",
      description: "Get verified instantly and earn consumer trust.",
      features: [
        "Verified trust tick on your profile card",
        "Higher ranking in category browse results",
        "2x priority on client matching queues",
      ],
      isActive: currentLevel === "verified" || currentLevel === "top",
      isCurrent: currentLevel === "verified",
      buttonText: currentLevel === "verified" || currentLevel === "top" ? "Active" : "Activate Verified Tick",
    },
    {
      id: "top",
      title: "Top-Rank Verified Elite",
      price: "Ksh 500 / mo",
      icon: Zap,
      colorClass: "text-amber-500",
      bgClass: "bg-amber-500/10 border-amber-500/20",
      description: "Propel your card to the top search results.",
      features: [
        "Everything in Verified Badge",
        "Always displayed at the top of category searches",
        "5x priority on client matching queues",
        "Featured Partner badge on profile search card",
      ],
      isActive: currentLevel === "top",
      isCurrent: currentLevel === "top",
      buttonText: currentLevel === "top" ? "Active" : "Upgrade to Top Partner",
    },
  ]

  return (
    <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-xl font-extrabold text-foreground">Membership & Boost Tiers</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Upgrade your profile tier package to build massive customer trust and listing priority.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tiers.map((tier) => {
          const Icon = tier.icon
          return (
            <Card
              key={tier.id}
              className={`flex flex-col justify-between border border-border/50 bg-card overflow-hidden transition-all duration-300 ${
                tier.isCurrent ? "ring-2 ring-primary border-transparent" : "hover:border-primary/25 hover:shadow-md"
              }`}
            >
              <div>
                <CardHeader className="border-b border-border/30 bg-muted/10 px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${tier.colorClass}`} />
                        <CardTitle className="text-base font-bold text-foreground">{tier.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs text-muted-foreground">{tier.description}</CardDescription>
                    </div>
                    {tier.isCurrent && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black text-primary uppercase">
                        Current
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 px-6 py-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-foreground">{tier.price}</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
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
                  className={`w-full h-10 rounded-lg text-xs font-bold transition-all ${
                    tier.isActive
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
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
