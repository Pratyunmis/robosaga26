"use client";

import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarItems } from "./sidebar-items";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Image from "next/image";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                className="flex items-center gap-2"
                href="/admin/dashboard"
              >
                <Image
                  src="/svg/robosaga.svg"
                  alt="RoboSaga '26"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-bold tracking-tight">
                  RoboSaga &apos;26
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Separator />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
