"use client"

import { useDashboard } from "./context/DashboardContext"
import { OverviewTab } from "./components/overview-tab"
import { useRouter } from "next/navigation"

export default function FundiDashboard() {
  const router = useRouter()
  const {
    user,
    profile,
    matchingLeads,
    completionScore,
    totalEarnings,
    referralEarnings,
    jobEarnings,
    portfolioItems,
    setIsAddPortfolioOpen,
    copyReferralLink,
    copiedReferral,
    setIsPremiumModalOpen,
    setPremiumModalType,
  } = useDashboard()

  const navigateToTab = (tab: string) => {
    if (tab === "overview") {
      router.push("/fundi/dashboard")
    } else {
      router.push(`/fundi/dashboard/${tab}`)
    }
  }

  return (
    <OverviewTab
      user={user}
      profile={profile}
      matchingLeads={matchingLeads}
      completionScore={completionScore}
      totalEarnings={totalEarnings}
      referralEarnings={referralEarnings}
      jobEarnings={jobEarnings}
      setActiveTab={navigateToTab}
      openPremiumModal={(type: "verified" | "top") => {
        setPremiumModalType(type)
        setIsPremiumModalOpen(true)
      }}
      portfolioItems={portfolioItems}
      setIsAddPortfolioOpen={setIsAddPortfolioOpen}
      copyReferralLink={copyReferralLink}
      copiedReferral={copiedReferral}
    />
  )
}
