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
import { Check, Loader2, Zap } from "lucide-react"
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
        <DialogContent className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Activate Premium
              Badge
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Boost your profile discovery rating and gain customer trust.
            </DialogDescription>
          </DialogHeader>
          <div className="my-2 space-y-4 border-t border-b border-border/30 py-4">
            <div className="space-y-1.5 rounded-xl border border-border bg-muted/40 p-3.5 text-center">
              <span className="text-[9px] font-black tracking-wider text-muted-foreground uppercase">
                Premium Badge
              </span>
              <div className="text-2xl font-black text-primary">
                Ksh 500 once
              </div>
              <p className="text-xs leading-normal text-muted-foreground">
                Verified trust tick, top search rankings, and 5x priority queue
                dispatch for customer leads.
              </p>
            </div>
            <div className="space-y-2 rounded-lg border border-primary/10 bg-primary/5 p-3 text-xs leading-normal text-muted-foreground">
              <div className="flex gap-1.5 font-medium">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>Immediate badge activation on profile search</span>
              </div>
              <div className="flex gap-1.5 font-medium">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>One-time activation fee</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPremiumModalOpen(false)}
              className="h-9.5 cursor-pointer rounded-lg px-4 text-xs text-muted-foreground"
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
              className="h-9.5 cursor-pointer rounded-lg bg-primary px-4 text-xs font-bold text-primary-foreground"
            >
              Pay Ksh 500 & Activate
            </PaystackButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={mounted && !!profile && !profile.isRegistrationPaid} onOpenChange={() => {}}>
        <DialogContent
          className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-lg select-none"
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Activate Account
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              A one-time registration fee is required to verify and activate your profile.
            </DialogDescription>
          </DialogHeader>

          <div className="my-2 space-y-4 border-t border-b border-border/30 py-4">
            <div className="space-y-1.5 rounded-xl border border-border bg-muted/40 p-3.5 text-center">
              <span className="text-[9px] font-black tracking-wider text-muted-foreground uppercase">
                One-Time Activation Fee
              </span>
              <div className="text-2xl font-black text-primary">
                Ksh 200 once
              </div>
              <p className="text-xs leading-normal text-muted-foreground">
                This fee activates your profile for background checks, trade credentials verification, and priority search listings.
              </p>
            </div>

            {registrationSuccess ? (
              <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3.5 py-2.5 text-xs text-green-600 dark:text-green-400">
                <Check className="h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">Payment successful!</p>
                  <p className="text-[10px] opacity-80">Activating your account...</p>
                </div>
              </div>
            ) : registrationError ? (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-2 text-[11px] text-destructive">
                <ShieldCheck className="h-4 w-4 shrink-0 rotate-180" />
                <span>{registrationError}</span>
              </div>
            ) : null}
          </div>

          <DialogFooter className="flex items-center justify-end">
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
              className="w-full h-9.5 cursor-pointer rounded-lg bg-primary text-xs font-bold text-primary-foreground"
            >
              Pay Ksh 200 & Activate Profile
            </PaystackButton>
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
