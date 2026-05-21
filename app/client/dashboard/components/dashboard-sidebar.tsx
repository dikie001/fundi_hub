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
import { LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function ClientDashboardSidebar({
  isCollapsed,
  menuItems,
  pathname,
  user,
  profile,
  onLogout,
}: {
  isCollapsed: boolean
  menuItems: any[]
  pathname: string
  user: any
  profile: any
  onLogout: () => void
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/40 bg-card/45 backdrop-blur-lg"
    >
      <SidebarHeader className="flex flex-row items-center justify-between border-b border-border/25 px-6 py-4">
        {isCollapsed ? (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-orange-500 text-xs font-black text-white shadow-xs select-none">
            FH
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-lg font-black tracking-tight text-transparent">
              FundiHub
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              Client
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
            {menuItems.map((item: any) => {
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

      <SidebarFooter className="space-y-3 border-t border-border/25 px-3 py-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 px-3 py-2.5">
            {profile?.image ? (
              <img
                src={profile.image}
                alt={user?.name}
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary uppercase">
                {user?.name?.slice(0, 2) || "CL"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-foreground">
                {user?.name || "Client"}
              </div>
              <div className="truncate text-[10px] text-muted-foreground">
                {user?.phone}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="h-9 w-9 cursor-pointer rounded-lg text-muted-foreground hover:text-foreground"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "sm"}
            onClick={onLogout}
            className={cn(
              "cursor-pointer rounded-lg text-muted-foreground hover:text-destructive",
              !isCollapsed && "flex-1 justify-start gap-2 px-3"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && (
              <span className="text-xs font-medium">Log Out</span>
            )}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
