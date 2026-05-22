"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Wrench,
  UserCheck,
  Tags,
  Star,
  Gift,
  ScrollText,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { UserMenu } from "@/components/user-menu"

const ADMIN_NAV = [
  {
    label: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin/dashboard",
      },
    ],
  },
  {
    label: "People",
    items: [
      {
        id: "users",
        label: "Users",
        icon: Users,
        href: "/admin/dashboard/users",
      },
      {
        id: "fundis",
        label: "Fundis",
        icon: Wrench,
        href: "/admin/dashboard/fundis",
      },
      {
        id: "clients",
        label: "Clients",
        icon: UserCheck,
        href: "/admin/dashboard/clients",
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        id: "categories",
        label: "Categories",
        icon: Tags,
        href: "/admin/dashboard/categories",
      },
      {
        id: "reviews",
        label: "Reviews",
        icon: Star,
        href: "/admin/dashboard/reviews",
      },
      {
        id: "referrals",
        label: "Referrals",
        icon: Gift,
        href: "/admin/dashboard/referrals",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        id: "audit",
        label: "Audit Logs",
        icon: ScrollText,
        href: "/admin/dashboard/audit-logs",
      },
    ],
  },
]

function findActive(pathname: string) {
  let best: { label: string; href: string } | undefined
  for (const group of ADMIN_NAV) {
    for (const item of group.items) {
      if (
        pathname === item.href ||
        (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
      ) {
        if (!best || item.href.length > best.href.length) {
          best = { label: item.label, href: item.href }
        }
      }
    }
  }
  return best ?? { label: "Dashboard", href: "/admin/dashboard" }
}

function Shell({
  children,
  userName,
  userPhone,
}: {
  children: React.ReactNode
  userName: string
  userPhone: string
}) {
  const pathname = usePathname()
  const active = findActive(pathname)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/auth/login"
  }

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-r border-border/40 bg-card/50 backdrop-blur-lg"
      >
        <SidebarHeader className="flex h-16 flex-row items-center border-b border-border/25 px-6">
          <div className="flex items-center gap-2">
            <span className="bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-lg font-black tracking-tight text-transparent">
              FundiHub
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              Admin
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent className="space-y-5 px-3 py-6">
          {ADMIN_NAV.map((group) => (
            <SidebarGroup key={group.label} className="p-0">
              <SidebarGroupLabel className="px-3 text-[10px] font-medium text-muted-foreground/60">
                {group.label}
              </SidebarGroupLabel>
              <SidebarMenu className="mt-2 space-y-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin/dashboard" &&
                      pathname.startsWith(item.href))
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        asChild
                        tooltip={item.label}
                        className="h-10 w-full cursor-pointer rounded-lg px-3.5 text-sm font-medium hover:bg-sidebar-accent"
                      >
                        <Link href={item.href}>
                          <Icon className="h-4.5 w-4.5" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t border-border/25 p-4 text-[10px] text-muted-foreground/60">
          FundiHub Admin Console
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border/40 bg-card/85 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <h2 className="text-sm font-medium text-muted-foreground capitalize">
              {active.label}
            </h2>
          </div>
          <UserMenu
            name={userName}
            phone={userPhone}
            role="admin"
            onLogout={handleLogout}
            variant="topbar"
          />
        </header>

        <div className="mx-auto w-full max-w-7xl grow px-6 py-8">
          {children}
        </div>
      </SidebarInset>
    </>
  )
}

export function AdminShell({
  children,
  userName,
  userPhone,
}: {
  children: React.ReactNode
  userName: string
  userPhone: string
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Shell userName={userName} userPhone={userPhone}>
        {children}
      </Shell>
    </SidebarProvider>
  )
}
