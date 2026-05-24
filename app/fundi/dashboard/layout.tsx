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
import { Check, Lock } from "lucide-react"
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
import { PaymentSuccessToast } from "@/components/payment-success-toast"

type PaymentSuccessState = {
  title: string
  description: string
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
    handleLogout,
  } = useDashboard()

  const [showPaymentToast, setShowPaymentToast] = useState(false)
  const [paymentSuccessState, setPaymentSuccessState] =
    useState<PaymentSuccessState | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get("payment") === "success") {
      const purpose = params.get("paymentPurpose")
      const heading = params.get("paymentHeading")

      if (purpose === "premium") {
        setPaymentSuccessState({
          title: heading || "You're now a Premium Fundi!",
          description:
            "Your gold verified badge is now active! You'll appear 5x higher in search results and receive priority leads from clients in your area.",
        })
      } else if (purpose === "registration") {
        setPaymentSuccessState({
          title: heading || "Welcome to FundiHub!",
          description:
            "Your profile is now live! Clients across Kenya can find you, send you job leads, and connect with you directly via WhatsApp or phone call.",
        })
      } else {
        setPaymentSuccessState({
          title: heading || "Payment Successful",
          description:
            "Your payment has been verified and your account has been updated.",
        })
      }
      setShowPaymentToast(true)
    }
  }, [])

  const clearPaymentQuery = () => {
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
        <DialogContent className="w-full max-w-xs rounded-xl border border-border bg-card p-5 shadow-lg">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-sm font-bold text-foreground">
              Upgrade to Premium
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Stand out and get more clients.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3.5 py-2.5">
              <span className="text-xs text-muted-foreground">
                One-time fee
              </span>
              <span className="text-base font-bold text-foreground">
                KSh 500
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-primary"
                  strokeWidth={2.5}
                />
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Gold badge
                  </span>{" "}
                  on your profile
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-primary"
                  strokeWidth={2.5}
                />
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    5x search boost
                  </span>{" "}
                  in results
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-primary"
                  strokeWidth={2.5}
                />
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Priority leads
                  </span>{" "}
                  before others
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPremiumModalOpen(false)}
              className="h-9 flex-1 cursor-pointer rounded-lg text-xs font-medium text-muted-foreground"
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
                returnTo: "/fundi/dashboard",
              }}
              skipConfirmation
              className="h-9 flex-1 cursor-pointer rounded-lg text-xs font-semibold transition-colors"
            >
              Pay KSh 500
            </PaystackButton>
          </div>

          <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-muted-foreground/50 select-none">
            <Lock className="h-3 w-3" />
            Secured by Paystack
          </p>
        </DialogContent>
      </Dialog>

      {paymentSuccessState ? (
        <PaymentSuccessToast
          open={showPaymentToast}
          title={paymentSuccessState.title}
          description={paymentSuccessState.description}
          onDismiss={() => {
            setShowPaymentToast(false)
            clearPaymentQuery()
          }}
        />
      ) : null}

      <Dialog
        open={mounted && !!profile && !profile.isRegistrationPaid}
        onOpenChange={() => {}}
      >
        <DialogContent
          className="w-full max-w-xs rounded-xl border border-border bg-card p-5 shadow-lg select-none"
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-sm font-bold text-foreground">
              Activate Your Profile
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              A one-time fee to go live and start receiving leads.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3.5 py-2.5">
              <span className="text-xs text-muted-foreground">
                Activation fee
              </span>
              <span className="text-base font-bold text-foreground">
                KSh 200
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-primary"
                  strokeWidth={2.5}
                />
                <span className="text-muted-foreground">
                  Profile visible to clients
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-primary"
                  strokeWidth={2.5}
                />
                <span className="text-muted-foreground">
                  Receive job leads in your area
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-primary"
                  strokeWidth={2.5}
                />
                <span className="text-muted-foreground">
                  Direct client connections
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
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
              className="h-9 w-full cursor-pointer rounded-lg text-xs font-semibold transition-colors"
            >
              Pay KSh 200 & Activate
            </PaystackButton>

            <p className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground/50 select-none">
              <Lock className="h-3 w-3" />
              Secured by Paystack
            </p>
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
