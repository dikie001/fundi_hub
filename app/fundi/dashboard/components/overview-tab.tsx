"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"
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
  openPremiumModal: () => void
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
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground/90">
          Habari, {user?.name || "Partner"}! 👋
        </h1>
        <p className="text-xs text-muted-foreground">
          You have{" "}
          <span className="font-semibold text-primary">
            {matchingLeads.length} matching job{" "}
            {matchingLeads.length === 1 ? "opportunity" : "opportunities"}
          </span>{" "}
          in{" "}
          <span className="font-medium text-foreground">
            {profile?.trade
              ? profile.trade
                  .split(",")
                  .map((s) => s.trim())
                  .join(", ")
              : "your trade"}
          </span>{" "}
          today.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground/80 uppercase">
              <Wrench
                className="h-3.5 w-3.5 text-primary/80"
                strokeWidth={1.8}
              />{" "}
              Matching Client Leads ({matchingLeads.length})
            </h2>
            <button
              onClick={() => setActiveTab("leads")}
              className="flex cursor-pointer items-center gap-0.5 text-xs font-semibold text-primary transition-all hover:underline"
            >
              View All Leads <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {matchingLeads.length > 0 ? (
            <div className="space-y-4">
              {matchingLeads.slice(0, 2).map((lead) => {
                const tradeTags = lead.trade
                  ? lead.trade.split(",").map((t) => t.trim())
                  : []
                const capitalizedLocation = lead.location
                  ? lead.location
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")
                  : ""

                return (
                  <Card
                    key={lead.id}
                    className="group hover:border-border-hover overflow-hidden border border-border bg-card shadow-2xs transition-all duration-300 hover:shadow-xs dark:hover:border-primary/20"
                  >
                    <CardHeader className="border-b border-border/30 bg-muted/15 px-5 py-4 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {tradeTags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground/90 capitalize"
                              >
                                {tag.toLowerCase()}
                              </span>
                            ))}
                            <span className="ml-1 flex items-center gap-1 text-[11px] text-muted-foreground/70">
                              <Clock className="h-3 w-3" strokeWidth={1.5} />{" "}
                              {lead.createdAt}
                            </span>
                          </div>
                          <CardTitle className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                            {lead.title}
                          </CardTitle>
                        </div>
                        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {lead.budget}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 p-5">
                      <p className="text-xs leading-relaxed text-muted-foreground/95">
                        {lead.description}
                      </p>
                      <div className="grid grid-cols-2 gap-3 border-t border-border/10 pt-3 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground/85">
                          <MapPin
                            className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50"
                            strokeWidth={1.8}
                          />
                          <span className="truncate">
                            {capitalizedLocation}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground/85">
                          <Calendar
                            className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50"
                            strokeWidth={1.8}
                          />
                          <span className="truncate">{lead.urgency}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                          <span>
                            Client:{" "}
                            <span className="font-semibold text-foreground">
                              {lead.clientName}
                            </span>
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="h-8 cursor-pointer rounded-lg px-3.5 text-xs font-medium"
                          >
                            <a
                              href={`tel:${lead.phone}`}
                              className="flex items-center gap-1.5"
                            >
                              <Phone
                                className="h-3.5 w-3.5"
                                strokeWidth={1.8}
                              />{" "}
                              Call
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            asChild
                            className="h-8 cursor-pointer rounded-lg px-3.5 text-xs font-medium"
                          >
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${lead.clientName},%2520I%2520saw%2520your%2520lead%2520on%2520FundiHub%252520for%252520'${encodeURIComponent(lead.title)}'%20and%252520I%252520am%252520available.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5"
                            >
                              <MessageSquare
                                className="h-3.5 w-3.5"
                                strokeWidth={1.8}
                              />{" "}
                              WhatsApp
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
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

        <div className="space-y-4">
          <div className="flex h-5 items-center">
            <h2 className="text-[11px] font-semibold tracking-wider text-muted-foreground/80 uppercase">
              Account Status
            </h2>
          </div>

          <Card className="border border-border/40 bg-card">
            <CardHeader className="pb-1">
              <CardTitle className="text-[11px] font-semibold tracking-wider text-muted-foreground/80 uppercase">
                Profile Completeness
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4 p-5 text-center">
              <div className="relative flex items-center justify-center">
                <svg className="h-20 w-20 -rotate-90 transform">
                  <circle
                    cx="40"
                    cy="40"
                    r="33"
                    stroke="currentColor"
                    strokeWidth="5"
                    className="text-border/40 dark:text-border/20"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="33"
                    stroke="currentColor"
                    strokeWidth="5"
                    className="text-primary"
                    fill="transparent"
                    strokeDasharray={207.35}
                    strokeDashoffset={207.35 * (1 - completionScore / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-base font-bold text-foreground">
                  {completionScore}%
                </span>
              </div>
              <p className="text-xs leading-normal text-muted-foreground/80">
                Upload portfolio photos of previous jobs to reach 100% and
                unlock high-paying client leads.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("profile")}
                className="h-8 w-full cursor-pointer rounded-lg border-border/60 text-xs font-medium transition-colors hover:bg-muted/50"
              >
                Manage Portfolio
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card">
            <CardHeader className="pb-1">
              <CardTitle className="text-[11px] font-semibold tracking-wider text-muted-foreground/80 uppercase">
                Professional Toolkits
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="divide-y divide-border/20 text-xs">
                <a
                  href="#"
                  className="flex items-center justify-between p-3.5 text-muted-foreground/85 transition-all duration-200 hover:bg-muted/40 hover:text-foreground"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <Download
                      className="h-4 w-4 text-muted-foreground/60"
                      strokeWidth={1.5}
                    />{" "}
                    Invoice Template (PDF)
                  </span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground/45" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3.5 text-muted-foreground/85 transition-all duration-200 hover:bg-muted/40 hover:text-foreground"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <HelpCircle
                      className="h-4 w-4 text-muted-foreground/60"
                      strokeWidth={1.5}
                    />{" "}
                    Tax Compliance Guide
                  </span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground/45" />
                </a>
                <a
                  href="tel:+254799112919"
                  className="flex items-center justify-between p-3.5 text-muted-foreground/85 transition-all duration-200 hover:bg-muted/40 hover:text-foreground"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <Phone
                      className="h-4 w-4 text-muted-foreground/60"
                      strokeWidth={1.5}
                    />{" "}
                    24/7 Agent Support
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/45" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
