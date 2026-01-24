"use client";

import { Loader2 } from "lucide-react";
import PrivateRoute from "@/components/auth/private-route";
// Import the NEW sidebar component (ensure you saved the previous code as app-sidebar.tsx)
import { AppSidebar } from "@/components/dashboard/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/use-auth-store";
import { useProfileStore } from "@/store/use-profile-store";

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  // FIX: Use the hook selector to ensure the component re-renders when loading changes
  const authLoading = useAuthStore((state) => state.loading);
  const profileLoading = useProfileStore((state) => state.loading);

  if (authLoading || profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PrivateRoute>
      {/* 1. Wrap everything in SidebarProvider */}
      <SidebarProvider>
        {/* 2. The Sidebar Component itself */}
        <AppSidebar />

        {/* 3. The Content Area (Inset) */}
        <SidebarInset>
          {/* Header with Mobile Trigger */}
          <header className="mt-16 flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <SidebarTrigger className="-ml-1" />
            <Separator className="mr-2 h-4" orientation="vertical" />
            <div className="flex items-center gap-2 px-4">
              {/* You can add Breadcrumbs here later */}
              <span className="font-medium">Dashboard</span>
            </div>
          </header>

          {/* Main Page Content */}
          <main className="flex-1 overflow-auto p-8">
            <div className="container">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </PrivateRoute>
  );
}
