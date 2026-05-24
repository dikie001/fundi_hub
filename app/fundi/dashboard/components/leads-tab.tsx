"use client"

import { useState } from "react"
import {
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { FundiLead, FundiProfileData } from "@/lib/types"

type LeadsTabProps = {
  profile: FundiProfileData | null
  matchingLeads: FundiLead[]
  appliedLeads: FundiLead[]
  archivedLeads: FundiLead[]
  handleApplyLead: (leadId: string) => void
  handleArchiveLead: (leadId: string) => void
  handleRestoreLead: (leadId: string) => void
  handleDeleteLeadPermanently: (leadId: string) => void
}

export function LeadsTab({
  profile,
  matchingLeads,
  appliedLeads,
  archivedLeads,
  handleApplyLead,
  handleArchiveLead,
  handleRestoreLead,
  handleDeleteLeadPermanently,
}: LeadsTabProps) {
  const [leadSubTab, setLeadSubTab] = useState<
    "matching" | "applied" | "archived"
  >("matching")

  const getActiveLeads = () => {
    switch (leadSubTab) {
      case "applied":
        return appliedLeads
      case "archived":
        return archivedLeads
      case "matching":
      default:
        return matchingLeads
    }
  }

  const activeLeads = getActiveLeads()

  return (
    <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
      <div className="flex flex-col gap-4 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground/90">
            Client Lead Matches
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Review, apply, and contact clients looking for{" "}
            {profile?.trade || "General"} services.
          </p>
        </div>
        <div className="flex gap-1.5 self-start rounded-xl border border-border/20 bg-muted/40 p-1 sm:self-center">
          {[
            ["matching", `Matching (${matchingLeads.length})`],
            ["applied", `Applied (${appliedLeads.length})`],
            ["archived", `Archived (${archivedLeads.length})`],
          ].map(([tab, label]) => (
            <button
              key={tab}
              onClick={() =>
                setLeadSubTab(tab as "matching" | "applied" | "archived")
              }
              className={cn(
                "cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:text-foreground",
                leadSubTab === tab
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground/75"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {activeLeads.length > 0 ? (
          activeLeads.map((lead) => {
            const tradeTags = lead.trade
              ? lead.trade.split(",").map((t) => t.trim())
              : []
            const capitalizedLocation = lead.location
              ? lead.location
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
              : ""

            return (
              <Card
                key={lead.id}
                className="flex flex-col justify-between overflow-hidden border border-border bg-card shadow-2xs transition-all duration-300 hover:shadow-xs hover:border-border-hover dark:hover:border-primary/20"
              >
                <div>
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
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground/70 ml-1">
                            <Clock className="h-3.5 w-3.5" strokeWidth={1.5} /> {lead.createdAt}
                          </span>
                        </div>
                        <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                          {lead.title}
                        </CardTitle>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {lead.budget}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-5">
                    <p className="text-xs leading-normal text-muted-foreground/95">
                      {lead.description}
                    </p>
                    <div className="grid grid-cols-2 gap-3 border-t border-border/10 pt-3 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground/85">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" strokeWidth={1.8} />
                        <span className="truncate">{capitalizedLocation}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground/85">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" strokeWidth={1.8} />
                        <span className="truncate">{lead.urgency}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {leadSubTab === "matching" && (
                  <div className="flex flex-col justify-between gap-4 border-t border-border/10 bg-muted/5 p-5 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                      <span>
                        Client:{" "}
                        <span className="font-semibold text-foreground">
                          {lead.clientName}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleArchiveLead(lead.id)}
                        className="h-8 cursor-pointer rounded-lg px-3.5 text-xs font-medium"
                      >
                        Archive
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApplyLead(lead.id)}
                        className="h-8 cursor-pointer rounded-lg px-3.5 text-xs font-medium"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                )}

                {leadSubTab === "applied" && (
                  <div className="flex flex-col justify-between gap-4 border-t border-border/10 bg-muted/5 p-5 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                      <span>
                        Client:{" "}
                        <span className="font-semibold text-foreground">
                          {lead.clientName}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
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
                          <Phone className="h-3.5 w-3.5" strokeWidth={1.8} /> Call
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
                          <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.8} /> WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {leadSubTab === "archived" && (
                  <div className="flex flex-col justify-between gap-4 border-t border-border/10 bg-muted/5 p-5 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                      <span>
                        Client:{" "}
                        <span className="font-semibold text-foreground">
                          {lead.clientName}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreLead(lead.id)}
                        className="h-8 cursor-pointer rounded-lg px-3.5 text-xs font-medium"
                      >
                        Restore
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteLeadPermanently(lead.id)}
                        className="h-8 cursor-pointer rounded-lg px-3.5 text-xs font-medium"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )
          })
        ) : (
          <div className="col-span-2">
            <Card className="border border-border bg-card/30 p-12 text-center shadow-2xs">
              <AlertCircle className="mx-auto mb-3 h-9 w-9 text-muted-foreground/75" />
              <h3 className="text-sm font-semibold text-foreground">
                No leads in {leadSubTab}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground/80">
                {leadSubTab === "matching" &&
                  `We match incoming projects based on your skill category (${profile?.trade || "General"}). Once a client submits a request, it will appear here.`}
                {leadSubTab === "applied" &&
                  "Applied leads you use will be listed here with options to call or chat with them."}
                {leadSubTab === "archived" &&
                  "Archived leads are kept here. You can restore them later or remove them permanently."}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
