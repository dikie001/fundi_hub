"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import type {
  ClientProfileData,
  DashboardMenuItem,
  SafeUser,
} from "@/lib/types"

export function ClientDashboardSidebar({
  isCollapsed,
  menuItems,
  pathname,
  user,
  profile,
}: {
  isCollapsed: boolean
  menuItems: DashboardMenuItem[]
  pathname: string
  user: SafeUser | null
  profile: ClientProfileData | null
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/40 bg-card/45 backdrop-blur-lg"
    >
      <SidebarHeader className="flex h-16 flex-row items-center border-b border-border/25 px-4">
        {isCollapsed ? (
          <img
            src="/fundi_hub_logo.jpg"
            alt="FundiHub"
            className="mx-auto h-8 w-8 rounded-lg object-cover"
          />
        ) : (
          <div className="flex items-center gap-2">
            <img
              src="/fundi_hub_logo.jpg"
              alt="FundiHub"
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-lg font-black tracking-tight text-transparent">
              FundiHub
            </span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="space-y-1 px-3 py-6">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-3 text-[10px] font-medium text-muted-foreground/60">
            Workspace
          </SidebarGroupLabel>
          <SidebarMenu className="mt-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={isActive}
                    asChild
                    tooltip={item.label}
                    className="h-10 w-full cursor-pointer rounded-lg px-3.5 text-sm font-medium hover:bg-sidebar-accent"
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/25 px-3 py-3">
        <div
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!isCollapsed && user && (
            <div className="flex min-w-0 items-center gap-2">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={user.name || ""}
                  className="h-7 w-7 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary uppercase">
                  {(user.name || "U").slice(0, 2)}
                </div>
              )}
              <span className="truncate text-xs font-semibold text-foreground">
                {user.name?.split(" ")[0] || "You"}
              </span>
            </div>
          )}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="h-8 w-8 shrink-0 cursor-pointer rounded-lg text-muted-foreground hover:text-foreground"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
