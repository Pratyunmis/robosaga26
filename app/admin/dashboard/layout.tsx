import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { AppSidebar } from "./_components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/admin/current-user";
import { CurrentUserDropdown } from "./_components/current-user";

import { Suspense } from "react";
import { RouteLoadingBar } from "./_components/route-loading-bar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "./_components/theme-toggle";
import { AdminLayoutSkeleton } from "./_components/skeletons";
import "./dashboard.css";

async function LayoutContent({ children }: { children: ReactNode }) {
  await connection();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/api/auth/signin?callbackUrl=/admin/dashboard");
  }

  if (currentUser.role !== "admin" && currentUser.role !== "moderator") {
    redirect("/");
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={currentUser} />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 w-full">
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <CurrentUserDropdown user={currentUser} />
            </div>
          </div>
        </header>
        <div className="h-full p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="font-(family-name:--font-inter)">
        <Suspense fallback={null}>
          <RouteLoadingBar />
        </Suspense>
        <Suspense fallback={<AdminLayoutSkeleton />}>
          <LayoutContent>{children}</LayoutContent>
        </Suspense>
      </div>
    </ThemeProvider>
  );
}
