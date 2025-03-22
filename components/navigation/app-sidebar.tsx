"use client"

import type * as React from "react"
import {
  Home,
  LayoutDashboard,
  ListChecks,
  LaptopMinimalIcon as LaptopMinimalCheck,
  User,
  ClipboardList,
  Gamepad2,
  Users,
  ScanQrCode,
  QrCodeIcon,
} from "lucide-react"
import { NavMain } from "./nav-main"
import { NavFooter } from "./nav-footer"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Events",
      url: "/admin/events",
      icon: ListChecks,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: User,
    },
    {
      title: "Registrations",
      url: "/admin/registrations",
      icon: ClipboardList,
    },
    {
      title: "Scan History",
      url: "/admin/scan-history",
      icon: QrCodeIcon,
    },
  ],
  navRoot: [
    {
      title: "Home Page",
      url: "/",
      icon: Home,
    },
    {
      title: "Events",
      url: "/events",
      icon: Gamepad2,
    },
    {
      title: "Scan QR",
      url: "/admin/scan-qr",
      icon: ScanQrCode,
    },
    {
      title: "Team",
      url: "/team",
      icon: Users,
    },
  ],
}

const AppSidebar: React.FC<React.ComponentProps<typeof Sidebar>> = ({ ...props }) => {
  const pathname = usePathname()

  return (
      <Sidebar collapsible="icon" variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <LaptopMinimalCheck className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Event&#39;25</span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} groupTitle="Admin" currentPath={pathname} />
          <NavMain items={data.navRoot} groupTitle="Event" currentPath={pathname} />
        </SidebarContent>
        <SidebarFooter>
          <NavFooter />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
  )
}

export default AppSidebar

