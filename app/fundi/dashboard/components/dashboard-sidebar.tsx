"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { User, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { useDashboard } from "../context/DashboardContext"

export function DashboardSidebar(props: any) {
  const {
    isCollapsed,
    menuItems,
    pathname,
    profile,
    mounted,
  } = props

  const {
    isAvailabilityDialogOpen,
    setIsAvailabilityDialogOpen,
    pendingAvailabilityValue,
    handleToggleAvailability,
    confirmAvailabilityChange,
  } = useDashboard()

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/40 bg-card/45 backdrop-blur-lg"
    >
      <SidebarHeader className="flex h-16 flex-row items-center border-b border-border/25 px-6">
        {isCollapsed ? (
          <img
            src="/fundi_hub_logo.jpeg"
            alt="FundiHub"
            className="mx-auto h-8 w-8 rounded-lg object-cover"
          />
        ) : (
          <div className="flex items-center gap-2">
            <img
              src="/fundi_hub_logo.jpeg"
              alt="FundiHub"
              className="h-8 w-8 rounded-lg object-cover"
            />
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

      <SidebarFooter className="space-y-3 border-t border-border/25 bg-muted/5 p-4">
        {isCollapsed ? (
          <>
            <div className="flex justify-center py-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center">
                    <Switch
                      id="availability-toggle-collapsed"
                      checked={profile?.isAvailable || false}
                      onCheckedChange={() =>
                        handleToggleAvailability(profile?.isAvailable)
                      }
                      className="scale-85 cursor-pointer"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs font-medium">
                  <div className="space-y-1">
                    <p className="font-semibold">
                      Availability Status:{" "}
                      {profile?.isAvailable ? "Available" : "Unavailable"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profile?.isAvailable
                        ? "Visible in client searches"
                        : "Hidden from searches"}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 cursor-pointer rounded-lg"
                  >
                    <Link href="/fundi/dashboard/profile">
                      <User className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  My Profile
                </TooltipContent>
              </Tooltip>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3.5 shadow-2xs">
              <div className="space-y-0.5">
                <Label
                  htmlFor="availability-toggle"
                  className="cursor-pointer text-xs font-medium text-foreground"
                >
                  Availability Status
                </Label>
                <p className="text-[10px] font-normal text-muted-foreground">
                  {profile?.isAvailable
                    ? "Available - Visible in searches"
                    : "Unavailable - Hidden from searches"}
                </p>
              </div>
              <Switch
                id="availability-toggle"
                checked={profile?.isAvailable || false}
                onCheckedChange={() =>
                  handleToggleAvailability(profile?.isAvailable)
                }
                className="cursor-pointer"
              />
            </div>

            <Button
              asChild
              variant="outline"
              className="w-full cursor-pointer rounded-lg border-border/40"
            >
              <Link
                href="/fundi/dashboard/profile"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </Link>
            </Button>
          </>
        )}

        <Dialog open={isAvailabilityDialogOpen} onOpenChange={setIsAvailabilityDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {pendingAvailabilityValue ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-orange-500" />
                )}
                {pendingAvailabilityValue ? "Set as Available?" : "Set as Unavailable?"}
              </DialogTitle>
              <DialogDescription className="pt-2 text-sm leading-relaxed">
                {pendingAvailabilityValue ? (
                  <>
                    <p className="font-medium text-foreground">You will appear in client searches and receive job leads.</p>
                    <p className="mt-2 text-muted-foreground">
                      Clients searching for fundis in your trade will be able to find and contact you.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-foreground">You will NOT appear in client searches and won't receive new leads.</p>
                    <p className="mt-2 text-muted-foreground">
                      You can turn this back on anytime to start receiving leads again.
                    </p>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAvailabilityDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmAvailabilityChange}
                className={pendingAvailabilityValue ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {pendingAvailabilityValue ? "Set as Available" : "Set as Unavailable"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  )
}
