"use client"

import { useDashboard } from "../context/DashboardContext"
import { ProfileTab } from "../components/profile-tab"

export default function ProfilePage() {
  const {
    user,
    profile,
    editName,
    setEditName,
    editTitle,
    setEditTitle,
    editTrades,
    setEditTrades,
    editYearsExp,
    setEditYearsExp,
    editArea,
    setEditArea,
    editDesc,
    setEditDesc,
    preferredContact,
    setPreferredContact,
    skills,
    setSkills,
    avatarUrl,
    handleAvatarChange,
    portfolioItems,
    isAddPortfolioOpen,
    setIsAddPortfolioOpen,
    completionScore,
    isUpdating,
    updateSuccess,
    handleUpdateProfile,
    setIsPremiumModalOpen,
    newPortfolioTitle,
    setNewPortfolioTitle,
    newPortfolioCategory,
    setNewPortfolioCategory,
    portfolioFile,
    setPortfolioFile,
    isPortfolioUploading,
    portfolioProgress,
    handlePortfolioUpload,
  } = useDashboard()

  return (
    <ProfileTab
      user={user}
      profile={profile}
      editName={editName}
      setEditName={setEditName}
      editTitle={editTitle}
      setEditTitle={setEditTitle}
      editTrades={editTrades}
      setEditTrades={setEditTrades}
      editYearsExp={editYearsExp}
      setEditYearsExp={setEditYearsExp}
      editArea={editArea}
      setEditArea={setEditArea}
      editDesc={editDesc}
      setEditDesc={setEditDesc}
      preferredContact={preferredContact}
      setPreferredContact={setPreferredContact}
      skills={skills}
      setSkills={setSkills}
      avatarUrl={avatarUrl}
      handleAvatarChange={handleAvatarChange}
      portfolioItems={portfolioItems}
      isAddPortfolioOpen={isAddPortfolioOpen}
      setIsAddPortfolioOpen={setIsAddPortfolioOpen}
      completionScore={completionScore}
      isUpdating={isUpdating}
      updateSuccess={updateSuccess}
      handleUpdateProfile={handleUpdateProfile}
      openPremiumModal={() => setIsPremiumModalOpen(true)}
      newPortfolioTitle={newPortfolioTitle}
      setNewPortfolioTitle={setNewPortfolioTitle}
      newPortfolioCategory={newPortfolioCategory}
      setNewPortfolioCategory={setNewPortfolioCategory}
      portfolioFile={portfolioFile}
      setPortfolioFile={setPortfolioFile}
      isPortfolioUploading={isPortfolioUploading}
      portfolioProgress={portfolioProgress}
      handlePortfolioUpload={handlePortfolioUpload}
    />
  )
}
