"use client"

import { DashboardProvider, useDashboard } from "./context/DashboardContext"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { ClientDashboardSidebar } from "./components/dashboard-sidebar"
import { Separator } from "@/components/ui/separator"
import { LayoutDashboard, Search, FolderKanban, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { UserMenu } from "@/components/user-menu"
import { ClientLoader } from "@/components/client-loader"

function DashboardGate({ children }: { children: React.ReactNode }) {
  const { isLoading } = useDashboard()
  if (isLoading) return <ClientLoader />
  return <>{children}</>
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const pathname = usePathname()
  const { user, profile, matchedFundis, handleLogout } = useDashboard()

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      href: "/client/dashboard",
    },
    {
      id: "find-fundis",
      label: "Find Fundis",
      icon: Search,
      badge: matchedFundis.length,
      href: "/client/dashboard/find-fundis",
    },
    {
      id: "my-project",
      label: "My Project",
      icon: FolderKanban,
      href: "/client/dashboard/my-project",
    },
    {
      id: "profile",
      label: "Profile Settings",
      icon: User,
      href: "/client/dashboard/profile",
    },
  ]

  const activeItem = menuItems.find((m) => m.href === pathname) || menuItems[0]

  return (
    <>
      <ClientDashboardSidebar
        isCollapsed={isCollapsed}
        menuItems={menuItems}
        pathname={pathname}
        user={user}
        profile={profile}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/40 bg-background/80 px-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <Separator orientation="vertical" className="mr-1 h-4" />
            <span className="text-sm font-semibold text-foreground">
              {activeItem.label}
            </span>
          </div>
          <UserMenu
            name={user?.name}
            phone={user?.phone}
            image={profile?.image ?? undefined}
            role="client"
            onLogout={handleLogout}
          />
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </>
  )
}

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardProvider>
      <DashboardGate>
        <SidebarProvider>
          <DashboardShell>{children}</DashboardShell>
        </SidebarProvider>
      </DashboardGate>
    </DashboardProvider>
  )
}
