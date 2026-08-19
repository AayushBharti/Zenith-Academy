"use client";

import type {
  SectionResponse,
  SubSectionResponse,
} from "@workspace/shared-types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Progress } from "@workspace/ui/components/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import {
  ArrowLeft,
  ChevronRight,
  ChevronsUpDown,
  Github,
  LogOut,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { dashboardLinks } from "@/data/user-menu-links";
import { useLogout } from "@/features/auth/hooks/use-auth-mutations";
import useViewCourseStore from "@/features/course/use-view-course-store";
import { useProfileStore } from "@/features/profile/use-profile-store";

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const isViewCoursePage = pathname.startsWith("/dashboard/enrolled-courses/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/">
                <img
                  alt=""
                  aria-hidden="true"
                  className="size-9"
                  src="/icon.svg"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Nextdemy</span>
                  <span className="truncate text-muted-foreground text-xs">
                    Learning Platform
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isViewCoursePage ? <CourseContent /> : <DashboardNav />}
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// ── Dashboard navigation (default) ──────────────────────────────────

function DashboardNav() {
  const { user } = useProfileStore();
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {dashboardLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;

            const Icon = link.icon;
            const isActive = pathname === link.path;

            return (
              <SidebarMenuItem key={link.path}>
                <SidebarMenuButton
                  asChild
                  className="py-5"
                  isActive={isActive}
                  tooltip={link.name}
                >
                  <Link href={link.path}>
                    <Icon />
                    <span>{link.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// ── Course content (view-course mode) ───────────────────────────────

function CourseContent() {
  const { courseId, subsectionId } = useParams();
  const router = useRouter();
  const activeSubsectionId = subsectionId as string;

  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    totalNoOfLectures,
  } = useViewCourseStore();

  const [manualToggles, setManualToggles] = useState<Record<string, boolean>>(
    {}
  );

  const isSectionOpen = useCallback(
    (section: SectionResponse) => {
      if (section._id in manualToggles) return manualToggles[section._id]!;
      return section.subSection.some((s) => s._id === activeSubsectionId);
    },
    [manualToggles, activeSubsectionId]
  );

  const completionPercentage =
    totalNoOfLectures > 0
      ? (completedLectures?.length / totalNoOfLectures) * 100
      : 0;

  return (
    <>
      {/* Back button + progress */}
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Back to courses">
                <Link href="/dashboard/enrolled-courses">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Courses</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Progress bar */}
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <div className="px-2 py-1">
          <div className="mb-1 truncate font-medium text-foreground text-xs">
            {courseEntireData?.courseName}
          </div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-muted-foreground">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <Progress className="h-2" value={completionPercentage} />
        </div>
      </SidebarGroup>

      {/* Course sections */}
      <SidebarGroup>
        <SidebarGroupLabel>Course Content</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {courseSectionData?.map((section: SectionResponse) => (
              <Collapsible
                key={section._id}
                onOpenChange={(open) =>
                  setManualToggles((prev) => ({
                    ...prev,
                    [section._id]: open,
                  }))
                }
                open={isSectionOpen(section)}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-auto py-2">
                      <Video className="h-4 w-4 shrink-0" />
                      <span className="font-medium">{section.sectionName}</span>
                      <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {section.subSection.map((sub: SubSectionResponse) => {
                        const isActive = sub._id === activeSubsectionId;
                        const isCompleted = completedLectures?.includes(
                          sub._id
                        );

                        return (
                          <SidebarMenuSubItem key={sub._id}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive}
                              size="sm"
                            >
                              <button
                                className="h-auto w-full py-1.5"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/enrolled-courses/${courseId}/section/${section._id}/sub-section/${sub._id}`
                                  )
                                }
                                type="button"
                              >
                                <Checkbox
                                  checked={isCompleted}
                                  className="h-3.5 w-3.5 shrink-0"
                                  disabled
                                />
                                <span className="line-clamp-2 text-left leading-snug">
                                  {sub.title}
                                </span>
                              </button>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}

// ── User footer menu ────────────────────────────────────────────────

function UserMenu() {
  const { user } = useProfileStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage alt={user?.firstName} src={user?.image} />
                <AvatarFallback className="rounded-lg">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt={user?.firstName} src={user?.image} />
                  <AvatarFallback className="rounded-lg">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {dashboardLinks.map((link) => {
                if (link.type && user?.accountType !== link.type) return null;
                const Icon = link.icon;
                return (
                  <DropdownMenuItem asChild key={link.path}>
                    <Link href={link.path}>
                      <Icon className="mr-2 h-4 w-4" />
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="https://github.com/AayushBharti/nextdemy"
                target="_blank"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
