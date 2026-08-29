"use client";

import type { CourseResponse as CourseDetails } from "@workspace/shared-types";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CoursesTable from "@/features/course/components/courses-table";
import { useInstructorCourses } from "@/features/course/hooks/use-course-queries";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";

export default function MyCourses() {
  const router = useRouter();
  const { data: queryCourses } = useInstructorCourses();

  // Local override state for CoursesTable's setCourses callback (e.g. after delete).
  // Will be removed once CoursesTable is migrated to use query invalidation (Task 9).
  const [localCourses, setLocalCourses] = useState<CourseDetails[] | null>(
    null
  );
  const courses = localCourses ?? queryCourses ?? null;

  return (
    <div className="container space-y-8 p-4 md:p-8">
      <DashboardPageHeader
        description="Manage your courses, track performance, and edit content."
        title="My Courses"
      >
        <Button
          animation="swap"
          onClick={() => router.push("/dashboard/add-course")}
        >
          Add Course
        </Button>
      </DashboardPageHeader>
      <div>
        {courses && (
          <CoursesTable courses={courses} setCourses={setLocalCourses} />
        )}
      </div>
    </div>
  );
}
