"use client"

import { useDashboard } from "../context/DashboardContext"
import { ReferralsTab } from "../components/referrals-tab"

export default function ReferralsPage() {
  const {
    user,
    referralCount,
    referralEarnings,
    copyReferralLink,
    copiedReferral,
  } = useDashboard()

  return (
    <ReferralsTab
      user={user}
      referralCount={referralCount}
      referralEarnings={referralEarnings}
      copyReferralLink={copyReferralLink}
      copiedReferral={copiedReferral}
    />
  )
}
