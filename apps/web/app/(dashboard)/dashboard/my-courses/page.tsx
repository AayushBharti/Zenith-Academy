"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CoursesTable from "@/components/dashboard/my-courses/courses-table";
import { Button } from "@/components/ui/button";
import { fetchInstructorCourses } from "@/services/course-details-service";
import { useAuthStore } from "@/store/use-auth-store";
import type { CourseDetails } from "@/types/course";

export default function MyCourses() {
  const { token } = useAuthStore();

  const router = useRouter();
  const [courses, setCourses] = useState<CourseDetails[] | null>(null);

  const fetchCourses = async () => {
    try {
      const result = await fetchInstructorCourses(token as string);
      if (result) {
        setCourses(result);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="">
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-1">
          <h1 className="font-bold text-3xl text-primary tracking-tight">
            My Courses
          </h1>
          <p className="text-muted-foreground">
            Manage your courses, track performance, and edit content.
          </p>
        </div>
        <Button
          className="flex items-center gap-x-2"
          onClick={() => router.push("/dashboard/add-course")}
        >
          <span>Add Course</span>
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>
      <div>
        {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
      </div>
    </div>
  );
}
