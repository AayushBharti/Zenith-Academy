"use client";

import {
  ArrowLeft,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  Settings,
  Star,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { logout } from "@/services/auth-service";
import { useProfileStore } from "@/store/use-profile-store";
import useViewCourseStore from "@/store/use-view-course-store";
import type { Section, SubSection } from "@/types/course";

interface VideoDetailsSidebarProps {
  setReviewModal: (value: boolean) => void;
}

export function VideoDetailsSidebar({
  setReviewModal,
}: VideoDetailsSidebarProps) {
  const [activeSubsectionId, setActiveSubsectionId] = useState<string>("");
  const router = useRouter();
  const { user } = useProfileStore();
  const { courseId, sectionId, subsectionId } = useParams();
  const { courseSectionData, completedLectures, totalNoOfLectures } =
    useViewCourseStore();

  useEffect(() => {
    if (!(courseSectionData && subsectionId)) return;
    setActiveSubsectionId(subsectionId as string);
  }, [courseSectionData, subsectionId]);

  const navigateToSubsection = (sectionId: string, subsectionId: string) => {
    router.push(
      `/view-course/${courseId}/section/${sectionId}/sub-section/${subsectionId}`
    );
  };

  const handleLogout = () => {
    logout(router.push);
  };

  const completionPercentage =
    totalNoOfLectures === 0
      ? 0
      : (completedLectures?.length / totalNoOfLectures) * 100;

  return (
    <Sidebar className="top-16 h-[calc(100vh-4rem)]!" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/dashboard/enrolled-courses">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <ArrowLeft className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Back to Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* --- Content: Course Modules --- */}
      <SidebarContent>
        {/* Course Progress - Hidden when collapsed */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <div className="px-2 py-2">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                Course Progress
              </span>
              <span className="text-muted-foreground">
                {Math.round(completionPercentage)}%
              </span>
            </div>
            <Progress className="h-2" value={completionPercentage} />
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Course Content</SidebarGroupLabel>
          <SidebarMenu>
            {courseSectionData?.map((section: Section) => (
              <Collapsible
                asChild
                className="group/collapsible"
                defaultOpen={section.subSection.some(
                  (s) => s._id === activeSubsectionId
                )}
                key={section._id}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="h-auto items-start"
                      tooltip={section.sectionName}
                    >
                      <Video className="mt-0.5 size-4" />
                      <span className="font-medium">{section.sectionName}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {section.subSection.map((subSection: SubSection) => {
                        const isActive = subSection._id === activeSubsectionId;
                        const isCompleted = completedLectures?.includes(
                          subSection._id
                        );

                        return (
                          <SidebarMenuSubItem key={subSection._id}>
                            <SidebarMenuSubButton
                              className="h-auto cursor-pointer py-2 pr-2"
                              isActive={isActive}
                              onClick={() =>
                                navigateToSubsection(
                                  section._id,
                                  subSection._id
                                )
                              }
                            >
                              <div className="flex w-full items-start gap-2">
                                <Checkbox
                                  checked={isCompleted}
                                  className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                                    isActive
                                      ? "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                      : "border-muted-foreground/50"
                                  }`}
                                  onCheckedChange={() => {
                                    // Read-only visual
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex min-w-0 flex-col gap-1">
                                  <span className="line-clamp-2 text-xs leading-snug">
                                    {subSection.title}
                                  </span>
                                  {/* <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                    <MonitorPlay className="h-3 w-3" />
                                    <span>
                                      {subSection.timeDuration || "10"} min
                                    </span>
                                  </div> */}
                                </div>
                              </div>
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
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      {/* --- Footer: User & Actions --- */}
      <SidebarFooter>
        <SidebarMenu>
          {/* Review Button */}
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setReviewModal(true)}
              tooltip="Rate this Course"
            >
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span>Rate this Course</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* User Profile Dropdown */}
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
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
