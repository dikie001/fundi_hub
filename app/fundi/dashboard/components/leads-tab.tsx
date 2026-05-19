"use client"

import { useState } from "react"
import { AlertCircle, Calendar, Clock, MapPin, Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Lead = {
  id: string
  clientName: string
  trade: string
  title: string
  location: string
  budget: string
  urgency: string
  description: string
  phone: string
  createdAt: string
}

type LeadsTabProps = {
  profile: any
  matchingLeads: Lead[]
  appliedLeads: Lead[]
  archivedLeads: Lead[]
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
  const [leadSubTab, setLeadSubTab] = useState<"matching" | "applied" | "archived">("matching")

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
          <h1 className="text-xl font-extrabold text-foreground">Client Lead Matches</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Review, apply, and contact clients looking for {profile?.trade || "General"} services.
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
              onClick={() => setLeadSubTab(tab as any)}
              className={cn(
                "cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-black uppercase transition-all hover:text-foreground",
                leadSubTab === tab ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {activeLeads.length > 0 ? (
          activeLeads.map((lead) => (
            <Card
              key={lead.id}
              className="flex flex-col justify-between overflow-hidden border-border bg-card shadow-2xs transition-colors hover:border-primary/45"
            >
              <div>
                <CardHeader className="border-b border-border/30 bg-muted/15 px-5 py-4 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-black text-primary uppercase">
                          {lead.trade}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" /> {lead.createdAt}
                        </span>
                      </div>
                      <CardTitle className="mt-2 text-sm font-black tracking-tight text-foreground">
                        {lead.title}
                      </CardTitle>
                    </div>
                    <span className="shrink-0 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-black text-emerald-500">
                      {lead.budget}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <p className="text-xs leading-normal text-muted-foreground">{lead.description}</p>
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
                </CardContent>
              </div>

              {leadSubTab === "matching" && (
                <div className="flex flex-col justify-between gap-4 border-t border-border/25 bg-muted/10 p-5 sm:flex-row sm:items-center">
                  <div className="text-xs text-muted-foreground">
                    Client: <span className="font-bold text-foreground">{lead.clientName}</span>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleArchiveLead(lead.id)}
                      className="h-8 cursor-pointer rounded-lg px-3 text-[11px] font-bold"
                    >
                      Archive
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApplyLead(lead.id)}
                      className="h-8 cursor-pointer rounded-lg px-3 text-[11px] font-bold"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              )}

              {leadSubTab === "applied" && (
                <div className="flex flex-col justify-between gap-4 border-t border-border/25 bg-muted/10 p-5 sm:flex-row sm:items-center">
                  <div className="text-xs text-muted-foreground">
                    Client: <span className="font-bold text-foreground">{lead.clientName}</span>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="h-8 cursor-pointer rounded-lg px-3 text-[11px] font-bold"
                    >
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" /> Call
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="h-8 cursor-pointer rounded-lg px-3 text-[11px] font-bold"
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
              )}

              {leadSubTab === "archived" && (
                <div className="flex flex-col justify-between gap-4 border-t border-border/25 bg-muted/10 p-5 sm:flex-row sm:items-center">
                  <div className="text-xs text-muted-foreground">
                    Client: <span className="font-bold text-foreground">{lead.clientName}</span>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreLead(lead.id)}
                      className="h-8 cursor-pointer rounded-lg px-3 text-[11px] font-bold"
                    >
                      Restore
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteLeadPermanently(lead.id)}
                      className="h-8 cursor-pointer rounded-lg px-3 text-[11px] font-bold"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))
        ) : (
          <div className="col-span-2">
            <Card className="border-border bg-card/30 p-12 text-center shadow-2xs">
              <AlertCircle className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />
              <h3 className="text-sm font-bold text-foreground">
                No leads in {leadSubTab}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
                {leadSubTab === "matching" &&
                  `We match incoming projects based on your skill category (${profile?.trade || "General"}). Once a client submits a request, it will appear here.`}
                {leadSubTab === "applied" &&
                  "Any leads you apply for will be listed here with options to call or chat with them."}
                {leadSubTab === "archived" &&
                  "Archived leads are kept here. You can restore them at any time or remove them permanently."}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
