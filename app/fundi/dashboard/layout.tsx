"use client"

import { useState } from "react"
import { DashboardProvider, useDashboard } from "./context/DashboardContext"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { Separator } from "@/components/ui/separator"
import { FundiLoader } from "@/components/fundi-loader"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Loader2, Zap, Lock, CheckCircle2 } from "lucide-react"
import {
  LayoutDashboard,
  Wrench,
  FolderKanban,
  DollarSign,
  ShieldCheck,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { UserMenu } from "@/components/user-menu"
import { PaystackButton } from "@/components/paystack-button"

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const pathname = usePathname()

  const {
    user,
    profile,
    isLoading,
    mounted,
    matchingLeads,
    isPremiumModalOpen,
    setIsPremiumModalOpen,
    premiumModalType,
    isProcessingPayment,
    setIsProcessingPayment,
    handleLogout,
    handleActivateBadge,
    fetchProfile,
  } = useDashboard()

  const [isVerifyingRegistration, setIsVerifyingRegistration] = useState(false)
  const [registrationError, setRegistrationError] = useState("")
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      badge: matchingLeads.length,
      href: "/fundi/dashboard",
    },
    {
      id: "leads",
      label: "Client Leads",
      icon: Wrench,
      badge: matchingLeads.length,
      href: "/fundi/dashboard/leads",
    },
    {
      id: "profile",
      label: "Profile & Portfolio",
      icon: FolderKanban,
      href: "/fundi/dashboard/profile",
    },
    {
      id: "referrals",
      label: "Referrals & Rewards",
      icon: DollarSign,
      href: "/fundi/dashboard/referrals",
    },
    {
      id: "membership",
      label: "Membership Benefits",
      icon: ShieldCheck,
      href: "/fundi/dashboard/membership",
    },
  ]

  // Determine active tab label from pathname matching
  const activeItem =
    menuItems.find((item) => item.href === pathname) || menuItems[0]

  if (isLoading) {
    return <FundiLoader />
  }

  return (
    <>
      <DashboardSidebar
        isCollapsed={isCollapsed}
        menuItems={menuItems}
        pathname={pathname}
        profile={profile}
        mounted={mounted}
      />

      <SidebarInset className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between bg-background px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <h2 className="text-sm font-medium text-muted-foreground capitalize">
              {activeItem.label}
            </h2>
          </div>
          <UserMenu
            name={user?.name}
            phone={user?.phone}
            image={profile?.image ?? undefined}
            role="fundi"
            onLogout={handleLogout}
            variant="topbar"
          />
        </header>

        <div className="mx-auto w-full max-w-7xl grow px-6 py-8">
          {children}
        </div>
      </SidebarInset>

      <Dialog open={isPremiumModalOpen} onOpenChange={setIsPremiumModalOpen}>
        <DialogContent className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" /> Activate Premium Badge
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Boost your profile discovery rating and gain customer trust.
            </DialogDescription>
          </DialogHeader>
          <div className="my-3 space-y-4 border-t border-b border-border/30 py-4">
            {/* Price Box */}
            <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent p-4 text-center">
              <span className="text-[10px] font-black tracking-wider text-primary uppercase">
                Premium Upgrade
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-3.5xl font-extrabold text-foreground tracking-tight">KSh 500</span>
                <span className="text-xs font-semibold text-muted-foreground">/once</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                Add a gold trust badge to your profile and rank first in search.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-2.5 px-1 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span className="text-muted-foreground">
                  <strong className="font-semibold text-foreground">Gold-verified badge</strong> displayed on search and profile pages
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span className="text-muted-foreground">
                  <strong className="font-semibold text-foreground">5x search boost</strong> in customer searches
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span className="text-muted-foreground">
                  <strong className="font-semibold text-foreground">Priority lead dispatch</strong> before standard profiles
                </span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsPremiumModalOpen(false)}
                className="h-10 flex-1 cursor-pointer rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <PaystackButton
                amount={500}
                email={user?.email || user?.phone + "@fundihub.com"}
                name={user?.name || "User"}
                phone={user?.phone || ""}
                onSuccess={(reference) => handleActivateBadge(reference)}
                onClose={() => setIsProcessingPayment(false)}
                disabled={isProcessingPayment}
                className="h-10 flex-1 cursor-pointer rounded-xl bg-gradient-to-r from-primary to-primary/95 text-xs font-bold text-primary-foreground shadow-md shadow-primary/10 transition-all hover:opacity-95 active:scale-[0.98]"
              >
                Pay KSh 500
              </PaystackButton>
            </div>
            
            <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground/60 select-none">
              <Lock className="h-3 w-3" />
              <span>Secured by Paystack • One-time charge</span>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={mounted && !!profile && !profile.isRegistrationPaid} onOpenChange={() => {}}>
        <DialogContent
          className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl select-none"
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" /> Profile Verification & Activation
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Verify your trade profile to connect with clients and start receiving direct job leads.
            </DialogDescription>
          </DialogHeader>

          <div className="my-3 space-y-4 border-t border-b border-border/30 py-4">
            {/* Price Box */}
            <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent p-4 text-center">
              <span className="text-[10px] font-black tracking-wider text-primary uppercase">
                One-Time Payment
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-3.5xl font-extrabold text-foreground tracking-tight">KSh 200</span>
                <span className="text-xs font-semibold text-muted-foreground">/once</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                Covers setup costs, credentials check, and profile prioritization.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-2.5 px-1 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span className="text-muted-foreground">
                  <strong className="font-semibold text-foreground">Background check</strong> and profile verification
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span className="text-muted-foreground">
                  <strong className="font-semibold text-foreground">Priority listing</strong> on search & discovery filters
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span className="text-muted-foreground">
                  <strong className="font-semibold text-foreground">Unlimited matching</strong> with direct client job leads
                </span>
              </div>
            </div>

            {registrationSuccess ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-green-500/20 bg-green-500/5 px-3.5 py-2.5 text-xs text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                <div>
                  <p className="font-semibold">Payment successful!</p>
                  <p className="text-[10px] opacity-80">Activating your account...</p>
                </div>
              </div>
            ) : registrationError ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 px-3.5 py-2.5 text-[11px] text-destructive">
                <ShieldCheck className="h-4.5 w-4.5 shrink-0 rotate-180 text-destructive" />
                <span>{registrationError}</span>
              </div>
            ) : null}
          </div>

          <DialogFooter className="flex flex-col gap-2.5">
            <PaystackButton
              amount={200}
              email={user?.email || `${user?.phone.replace(/[^0-9]/g, "")}@fundihub.com`}
              name={user?.name || "Fundi Partner"}
              phone={user?.phone || ""}
              onSuccess={async (ref) => {
                setIsVerifyingRegistration(true)
                setRegistrationError("")
                try {
                  const response = await fetch("/api/payments/verify-registration", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      reference: ref,
                      userId: user?.id,
                    }),
                  })
                  const data = await response.json()
                  if (response.ok && data.success) {
                    setRegistrationSuccess(true)
                    await fetchProfile()
                  } else {
                    setRegistrationError(data.error || "Payment verification failed. Please try again.")
                  }
                } catch (err) {
                  console.error("Payment verification error:", err)
                  setRegistrationError("An error occurred during verification. Please try again.")
                } finally {
                  setIsVerifyingRegistration(false)
                }
              }}
              onClose={() => {}}
              disabled={isVerifyingRegistration || registrationSuccess}
              className="w-full h-10 cursor-pointer rounded-xl bg-gradient-to-r from-primary to-primary/95 text-xs font-bold text-primary-foreground shadow-md shadow-primary/10 transition-all hover:opacity-95 active:scale-[0.98]"
            >
              Pay KSh 200 & Activate Profile
            </PaystackButton>
            
            <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground/60 select-none">
              <Lock className="h-3 w-3" />
              <span>Secured by Paystack • No recurring charges</span>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardProvider>
      <SidebarProvider defaultOpen={true}>
        <DashboardShell>{children}</DashboardShell>
      </SidebarProvider>
    </DashboardProvider>
  )
}
