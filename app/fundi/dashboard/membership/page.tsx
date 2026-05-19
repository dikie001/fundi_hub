"use client"

import { useDashboard } from "../context/DashboardContext"
import { MembershipTab } from "../components/membership-tab"

export default function MembershipPage() {
  const {
    profile,
    setIsPremiumModalOpen,
    setPremiumModalType,
  } = useDashboard()

  return (
    <MembershipTab
      profile={profile}
      openPremiumModal={(type: "verified" | "top") => {
        setPremiumModalType(type)
        setIsPremiumModalOpen(true)
      }}
    />
  )
}
