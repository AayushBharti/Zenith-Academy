"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import useViewCourseStore from "@/features/course/use-view-course-store";

const formatSegment = (segment: string) => {
  if (!segment) return "";
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function DashboardHeader() {
  const pathname = usePathname();
  const isViewCoursePage = pathname.startsWith(
    "/dashboard/enrolled-courses/"
  );

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger />
      <Separator orientation="vertical" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {isViewCoursePage ? (
            <ViewCourseBreadcrumb />
          ) : (
            <DefaultBreadcrumb pathname={pathname} />
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}

function ViewCourseBreadcrumb() {
  const { courseEntireData } = useViewCourseStore();

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/dashboard/enrolled-courses">Enrolled Courses</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="max-w-60 truncate font-medium">
          {courseEntireData?.courseName ?? "..."}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}

function DefaultBreadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);

  return (
    <>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;

        return (
          <React.Fragment key={href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-medium">
                  {formatSegment(segment)}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={href}>{formatSegment(segment)}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        );
      })}
    </>
  );
}
