"use client"

import { useEffect, useMemo, useState } from "react"
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
import { Check, Zap, Lock } from "lucide-react"
import {
  LayoutDashboard,
  Wrench,
  FolderKanban,
  DollarSign,
  ShieldCheck,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useRouter, useSearchParams } from "next/navigation"
import { UserMenu } from "@/components/user-menu"
import { PaystackButton } from "@/components/paystack-button"
import { PaymentSuccessModal } from "@/components/payment-success-modal"

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    user,
    profile,
    isLoading,
    mounted,
    matchingLeads,
    isPremiumModalOpen,
    setIsPremiumModalOpen,
    premiumModalType,
    handleLogout,
  } = useDashboard()

  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)

  const paymentPurpose = searchParams.get("paymentPurpose")
  const paymentStatus = searchParams.get("payment")
  const paymentReference = searchParams.get("paymentReference")
  const paymentAmount = searchParams.get("paymentAmount")
  const paymentHeading = searchParams.get("paymentHeading")

  const successModalState = useMemo(() => {
    if (paymentStatus !== "success" || paymentPurpose !== "premium") {
      return null
    }

    return {
      title: paymentHeading || "Payment successful",
      description:
        "Your premium upgrade was verified and your dashboard has been updated.",
      amountLabel: paymentAmount || "KSh 500",
      reference: paymentReference,
    }
  }, [
    paymentAmount,
    paymentHeading,
    paymentPurpose,
    paymentReference,
    paymentStatus,
  ])

  useEffect(() => {
    setShowPaymentSuccess(Boolean(successModalState))
  }, [successModalState])

  const clearPaymentQuery = () => {
    setShowPaymentSuccess(false)
    router.replace("/fundi/dashboard")
  }

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
              <ShieldCheck className="h-4.5 w-4.5 text-primary" /> Activate
              Premium Badge
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Boost your profile discovery rating and gain customer trust.
            </DialogDescription>
          </DialogHeader>
          <div className="my-3 space-y-4 border-t border-b border-border/30 py-4">
            {/* Price Box */}
            <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-linear-to-b from-primary/10 via-primary/5 to-transparent p-4 text-center">
              <span className="text-[10px] font-black tracking-wider text-primary uppercase">
                Premium Upgrade
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-3.5xl font-extrabold tracking-tight text-foreground">
                  KSh 500
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  /once
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                Add a gold trust badge to your profile and rank first in search.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-2.5 px-1 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3 stroke-3" />
                </div>
                <span className="text-muted-foreground">
                  <strong className="font-semibold text-foreground">
                    Gold-verified badge
                  </strong>{" "}
                  displayed on search and profile pages
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3 stroke-3" />
                </div>
                <span className="text-muted-foreground">
                  <strong className="font-semibold text-foreground">
                    5x search boost
                  </strong>{" "}
                  in customer searches
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3 stroke-3" />
                </div>
                <span className="text-muted-foreground">
                  <strong className="font-semibold text-foreground">
                    Priority lead dispatch
                  </strong>{" "}
                  before standard profiles
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
                callbackPath="/api/payments/callback"
                callbackParams={{
                  purpose: "premium",
                  premiumLevel: premiumModalType,
                  returnTo: "/fundi/dashboard",
                }}
                className="h-10 flex-1 cursor-pointer rounded-xl bg-linear-to-r from-primary to-primary/95 text-xs font-bold text-primary-foreground shadow-md shadow-primary/10 transition-all hover:opacity-95 active:scale-[0.98]"
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

      {successModalState ? (
        <PaymentSuccessModal
          open={showPaymentSuccess}
          title={successModalState.title}
          description={successModalState.description}
          amountLabel={successModalState.amountLabel}
          reference={successModalState.reference}
          onContinue={clearPaymentQuery}
        />
      ) : null}

      <Dialog
        open={mounted && !!profile && !profile.isRegistrationPaid}
        onOpenChange={() => {}}
      >
        <DialogContent
          className="w-full max-w-85 rounded-2xl border border-border bg-card p-6 shadow-xl select-none"
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" /> Activate
              Profile
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              A one-time verification fee is required to activate your partner
              profile.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 flex flex-col items-center justify-center border-t border-b border-border/30 py-4 text-center">
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              One-Time Activation Fee
            </span>
            <span className="mt-1 text-3xl font-extrabold tracking-tight text-primary">
              KSh 200
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <PaystackButton
              amount={200}
              email={
                user?.email ||
                `${user?.phone.replace(/[^0-9]/g, "")}@fundihub.com`
              }
              name={user?.name || "Fundi Partner"}
              phone={user?.phone || ""}
              callbackPath="/api/payments/callback"
              callbackParams={{
                purpose: "registration",
                userId: user?.id || "",
                returnTo: "/fundi/dashboard",
              }}
              className="h-10 w-full cursor-pointer rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              Pay KSh 200 & Activate Profile
            </PaystackButton>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/60 select-none">
              <Lock className="h-3.5 w-3.5" />
              <span>Secured by Paystack • One-time payment</span>
            </div>
          </div>
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
