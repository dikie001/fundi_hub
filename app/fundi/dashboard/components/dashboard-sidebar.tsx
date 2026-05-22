"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"
import Link from "next/link"

export function DashboardSidebar(props: any) {
  const {
    isCollapsed,
    menuItems,
    pathname,
    profile,
    mounted,
    resolvedTheme,
    setTheme,
    handleToggleEmergency,
  } = props

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/40 bg-card/45 backdrop-blur-lg"
    >
      <SidebarHeader className="flex h-16 flex-row items-center border-b border-border/25 px-6">
        {isCollapsed ? (
          <img src="/fundi_hub_logo.jpeg" alt="FundiHub" className="h-8 w-8 rounded-lg object-cover mx-auto" />
        ) : (
          <div className="flex items-center gap-2">
            <img src="/fundi_hub_logo.jpeg" alt="FundiHub" className="h-8 w-8 rounded-lg object-cover" />
            <span className="bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-lg font-black tracking-tight text-transparent">
              FundiHub
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              Partner
            </span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="space-y-6 px-3 py-6">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-3 text-[10px] font-medium text-muted-foreground/60">
            Core Operations
          </SidebarGroupLabel>
          <SidebarMenu className="mt-2 space-y-2">
            {menuItems.slice(0, 3).map((item: any) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={isActive}
                    asChild
                    tooltip={item.label}
                    className="h-10.5 w-full cursor-pointer rounded-lg px-3.5 text-sm font-medium hover:bg-sidebar-accent"
                  >
                    <Link href={item.href}>
                      <Icon className="h-4.5 w-4.5" />
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

        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-3 text-[10px] font-medium text-muted-foreground/60">
            Grow & Benefits
          </SidebarGroupLabel>
          <SidebarMenu className="mt-2 space-y-2">
            {menuItems.slice(3).map((item: any) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={isActive}
                    asChild
                    tooltip={item.label}
                    className="h-10.5 w-full cursor-pointer rounded-lg px-3.5 text-sm font-medium hover:bg-sidebar-accent"
                  >
                    <Link href={item.href}>
                      <Icon className="h-4.5 w-4.5" />
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

      <SidebarFooter className="space-y-4 border-t border-border/25 bg-muted/5 p-4">
        {isCollapsed ? (
          <div className="flex justify-center py-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center">
                  <Switch
                    id="emergency-toggle-collapsed"
                    checked={profile?.isEmergency || false}
                    onCheckedChange={() =>
                      handleToggleEmergency(profile?.isEmergency)
                    }
                    className="scale-85 cursor-pointer"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                On-Call Status: {profile?.isEmergency ? "Online" : "Offline"}
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3.5 shadow-2xs">
            <div className="space-y-0.5">
              <Label
                htmlFor="emergency-toggle"
                className="cursor-pointer text-xs font-medium text-foreground"
              >
                On-Call Status
              </Label>
              <p className="text-[10px] font-normal text-muted-foreground">
                {profile?.isEmergency ? "Online" : "Offline"}
              </p>
            </div>
            <Switch
              id="emergency-toggle"
              checked={profile?.isEmergency || false}
              onCheckedChange={() =>
                handleToggleEmergency(profile?.isEmergency)
              }
              className="cursor-pointer"
            />
          </div>
        )}

        {mounted && (
          <div className="flex justify-center border-t border-border/30 pt-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 cursor-pointer rounded-lg"
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="h-4.5 w-4.5 text-amber-500" />
                  ) : (
                    <Moon className="h-4.5 w-4.5 text-zinc-700" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
