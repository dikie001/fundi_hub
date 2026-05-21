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
import { Loader2 } from "lucide-react"

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const pathname = usePathname()
  const { user, profile, isLoading, matchedFundis, handleLogout } =
    useDashboard()

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3.5 bg-background text-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Loading your workspace...
        </p>
      </div>
    )
  }

  return (
    <>
      <ClientDashboardSidebar
        isCollapsed={isCollapsed}
        menuItems={menuItems}
        pathname={pathname}
        user={user}
        profile={profile}
        onLogout={handleLogout}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b border-border/40 bg-background/80 px-4 backdrop-blur-sm">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-semibold text-foreground">
            {activeItem.label}
          </span>
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
      <SidebarProvider>
        <DashboardShell>{children}</DashboardShell>
      </SidebarProvider>
    </DashboardProvider>
  )
}
