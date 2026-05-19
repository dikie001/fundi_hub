"use client"

import { useDashboard } from "../context/DashboardContext"
import { LeadsTab } from "../components/leads-tab"

export default function LeadsPage() {
  const {
    profile,
    matchingLeads,
    appliedLeads,
    archivedLeads,
    handleApplyLead,
    handleArchiveLead,
    handleRestoreLead,
    handleDeleteLeadPermanently,
  } = useDashboard()

  return (
    <LeadsTab
      profile={profile}
      matchingLeads={matchingLeads}
      appliedLeads={appliedLeads}
      archivedLeads={archivedLeads}
      handleApplyLead={handleApplyLead}
      handleArchiveLead={handleArchiveLead}
      handleRestoreLead={handleRestoreLead}
      handleDeleteLeadPermanently={handleDeleteLeadPermanently}
    />
  )
}
