"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  HelpCircle,
  MapPin,
  MessageSquare,
  Phone,
  Wrench
} from "lucide-react"
import type { FundiLead, FundiProfileData, SafeUser } from "@/lib/types"
import type { PortfolioItem } from "../context/DashboardContext"

type OverviewTabProps = {
  user: SafeUser | null
  profile: FundiProfileData | null
  matchingLeads: FundiLead[]
  completionScore: number
  totalEarnings: number
  referralEarnings: number
  jobEarnings: number
  setActiveTab: (tab: string) => void
  openPremiumModal: (type: "verified" | "top") => void
  portfolioItems: PortfolioItem[]
  setIsAddPortfolioOpen: (open: boolean) => void
  copyReferralLink: () => void
  copiedReferral: boolean
}

export function OverviewTab(props: OverviewTabProps) {
  const {
    user,
    profile,
    matchingLeads,
    completionScore,
    totalEarnings,
    referralEarnings,
    jobEarnings,
    setActiveTab,
    openPremiumModal,
    portfolioItems,
    setIsAddPortfolioOpen,
    copyReferralLink,
    copiedReferral,
  } = props
  const referralLink =
    user && typeof window !== "undefined"
      ? `${window.location.origin}/auth/signup?ref=${user.id}`
      : ""

  return (
    <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground">
          Habari, {user?.name || "Partner"}! 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          You have{" "}
          <span className="font-bold text-primary">
            {matchingLeads.length} matching job{" "}
            {matchingLeads.length === 1 ? "opportunity" : "opportunities"}
          </span>{" "}
          in {profile?.trade || "your trade"} today.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-black tracking-tight text-foreground uppercase">
              <Wrench className="h-4 w-4 text-primary" /> Matching Client Leads
              ({matchingLeads.length})
            </h2>
            <button
              onClick={() => setActiveTab("leads")}
              className="flex cursor-pointer items-center gap-0.5 text-xs font-bold text-primary hover:underline"
            >
              View All Leads <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {matchingLeads.length > 0 ? (
            <div className="space-y-4">
              {matchingLeads.slice(0, 2).map((lead) => (
                <Card
                  key={lead.id}
                  className="group overflow-hidden border-border bg-card shadow-2xs transition-all duration-300 hover:border-primary/45"
                >
                  <CardHeader className="border-b border-border/30 bg-muted/15 px-5 py-4 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-primary/10 px-2.5 py-0.5 text-xs font-black text-primary uppercase">
                            {lead.trade}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" /> {lead.createdAt}
                          </span>
                        </div>
                        <CardTitle className="mt-2 text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {lead.title}
                        </CardTitle>
                      </div>
                      <span className="shrink-0 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-sm font-black text-emerald-500">
                        {lead.budget}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-5">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {lead.description}
                    </p>
                    <div className="grid grid-cols-2 gap-3 border-t border-border/20 pt-3 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">{lead.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">{lead.urgency}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="text-xs text-muted-foreground">
                        Client:{" "}
                        <span className="font-bold text-foreground">
                          {lead.clientName}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="h-8 cursor-pointer rounded-lg px-3 text-xs font-bold"
                        >
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-1.5"
                          >
                            <Phone className="h-3.5 w-3.5" /> Call
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          asChild
                          className="h-8 cursor-pointer rounded-lg px-3 text-xs font-bold"
                        >
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${lead.clientName},%2520I%2520saw%2520your%2520lead%2520on%2520FundiHub%252520for%252520'${encodeURIComponent(lead.title)}'%20and%252520I%252520am%252520available.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5"
                          >
                            <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border bg-card/30 p-8 text-center shadow-xs">
              <AlertCircle className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <h3 className="text-sm font-bold text-foreground">
                No matches at the moment
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
                We match incoming projects based on your trade (
                {profile?.trade || "General"}). Once a client submits a matching
                request, it will appear here.
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <Card className="border border-border/60 bg-card">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-black tracking-wider text-foreground uppercase">
                Profile Completeness
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4 p-5 text-center">
              <div className="relative flex items-center justify-center">
                <svg className="h-20 w-20 -rotate-90 transform">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="5.5"
                    className="text-muted/65"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="5.5"
                    className="text-primary"
                    fill="transparent"
                    strokeDasharray={213.62}
                    strokeDashoffset={213.62 * (1 - completionScore / 100)}
                  />
                </svg>
                <span className="absolute text-base font-black text-foreground">
                  {completionScore}%
                </span>
              </div>
              <p className="text-xs leading-normal text-muted-foreground">
                Upload portfolio photos of previous jobs to reach 100% and
                unlock high-paying client leads.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("profile")}
                className="h-8 w-full cursor-pointer rounded-xl text-xs font-bold"
              >
                Manage Portfolio
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-black tracking-wider text-foreground uppercase">
                Refer & Earn Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 pt-3">
              <p className="text-xs leading-normal text-muted-foreground">
                Earn KES 100 instantly for every partner who signs up using your
                unique link.
              </p>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="min-w-0 flex-1 rounded-lg border border-border/40 bg-muted/60 p-2.5 font-mono text-xs text-muted-foreground outline-hidden select-all"
                />
                <Button
                  size="sm"
                  onClick={copyReferralLink}
                  className="h-8.5 shrink-0 cursor-pointer rounded-lg px-3 text-xs font-bold"
                >
                  {copiedReferral ? "Copied!" : "Copy"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-black tracking-wider text-foreground uppercase">
                Professional Toolkits
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="divide-y divide-border/25 text-xs">
                <a
                  href="#"
                  className="flex items-center justify-between p-3.5 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <Download className="h-4 w-4 text-primary" /> Invoice
                    Template (PDF)
                  </span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3.5 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <HelpCircle className="h-4 w-4 text-primary" /> Tax
                    Compliance Guide
                  </span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="tel:+254799112919"
                  className="flex items-center justify-between p-3.5 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <Phone className="h-4 w-4 text-primary" /> 24/7 Agent
                    Support
                  </span>
                  <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
