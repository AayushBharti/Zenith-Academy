"use client";

import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { useState } from "react";
import PrivateRoute from "@/features/auth/components/private-route";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { AppSidebar } from "@/features/dashboard/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <PrivateRoute>
      <SidebarProvider onOpenChange={setSidebarOpen} open={isSidebarOpen}>
        <AppSidebar />
        <SidebarInset className="">
          <DashboardHeader />
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </PrivateRoute>
  );
}
