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
import { useRouter } from "next/navigation"
import { UserMenu } from "@/components/user-menu"
import { PaystackButton } from "@/components/paystack-button"
import { PaymentSuccessModal } from "@/components/payment-success-modal"
import { PaymentSuccessToast } from "@/components/payment-success-toast"

type PaymentSuccessState = {
  title: string
  description: string
  amountLabel: string
  reference?: string | null
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const pathname = usePathname()
  const router = useRouter()

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
  const [showPaymentToast, setShowPaymentToast] = useState(false)
  const [paymentSuccessState, setPaymentSuccessState] =
    useState<PaymentSuccessState | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get("payment") === "success") {
      const purpose = params.get("paymentPurpose")
      const heading = params.get("paymentHeading")
      const amount = params.get("paymentAmount")
      const reference = params.get("paymentReference")

      if (purpose === "premium") {
        setPaymentSuccessState({
          title: heading || "You're now a Premium Fundi!",
          description:
            "Your gold verified badge is now active! You'll appear 5x higher in search results and receive priority leads from clients in your area.",
          amountLabel: amount || "KSh 500",
          reference,
        })
      } else if (purpose === "registration") {
        setPaymentSuccessState({
          title: heading || "Welcome to FundiHub!",
          description:
            "Your profile is now live! Clients across Kenya can find you, send you job leads, and connect with you directly via WhatsApp or phone call.",
          amountLabel: amount || "KSh 200",
          reference,
        })
      } else {
        setPaymentSuccessState({
          title: heading || "Payment Successful",
          description:
            "Your payment has been verified and your account has been updated.",
          amountLabel: amount || "",
          reference,
        })
      }
      setShowPaymentSuccess(true)
      setShowPaymentToast(true)
    }
  }, [])

  const clearPaymentQuery = () => {
    setShowPaymentSuccess(false)
    setShowPaymentToast(false)
    setPaymentSuccessState(null)
    const url = new URL(window.location.href)
    url.searchParams.delete("payment")
    url.searchParams.delete("paymentPurpose")
    url.searchParams.delete("paymentReference")
    url.searchParams.delete("paymentAmount")
    url.searchParams.delete("paymentHeading")
    window.history.replaceState({}, "", url.pathname)
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
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border bg-sidebar px-6">
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
                skipConfirmation
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

      {paymentSuccessState ? (
        <PaymentSuccessToast
          open={showPaymentToast}
          title={paymentSuccessState.title}
          description={paymentSuccessState.description}
          amountLabel={paymentSuccessState.amountLabel}
          reference={paymentSuccessState.reference}
          onDismiss={() => setShowPaymentToast(false)}
        />
      ) : null}

      {paymentSuccessState ? (
        <PaymentSuccessModal
          open={showPaymentSuccess}
          title={paymentSuccessState.title}
          description={paymentSuccessState.description}
          amountLabel={paymentSuccessState.amountLabel}
          reference={paymentSuccessState.reference}
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
              skipConfirmation
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
