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
    portfolioItems,
    isAddPortfolioOpen,
    setIsAddPortfolioOpen,
    completionScore,
    isUpdating,
    isAvatarUploading,
    updateSuccess,
    updateError,
    handleUpdateProfile,
    handleAvatarUpload,
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
      isAvatarUploading={isAvatarUploading}
      handleAvatarUpload={handleAvatarUpload}
      portfolioItems={portfolioItems}
      isAddPortfolioOpen={isAddPortfolioOpen}
      setIsAddPortfolioOpen={setIsAddPortfolioOpen}
      completionScore={completionScore}
      isUpdating={isUpdating}
      updateSuccess={updateSuccess}
      updateError={updateError}
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
