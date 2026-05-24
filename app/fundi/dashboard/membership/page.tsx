"use client"

import { useDashboard } from "../context/DashboardContext"
import { MembershipTab } from "../components/membership-tab"

export default function MembershipPage() {
  const { profile, setIsPremiumModalOpen } = useDashboard()

  return (
    <MembershipTab
      profile={profile}
      openPremiumModal={() => setIsPremiumModalOpen(true)}
    />
  )
}
