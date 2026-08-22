"use client";

import { useQuery } from "@tanstack/react-query";
import type { CourseStats, EnrolledCoursesUser } from "@workspace/shared-types";
import { apiCall } from "@/lib/api-call";
import { profileEndpoints } from "@/lib/apis";
import { queryKeys } from "@/lib/query-keys";

/** Fetch enrolled courses for the authenticated user. */
export function useEnrolledCourses() {
  return useQuery({
    queryKey: queryKeys.profile.enrolledCourses(),
    queryFn: async () => {
      const result = await apiCall<EnrolledCoursesUser>(
        "GET",
        profileEndpoints.GET_USER_ENROLLED_COURSES_API
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });
}

/** Fetch instructor dashboard statistics. */
export function useInstructorDashboard() {
  return useQuery({
    queryKey: queryKeys.profile.instructorDashboard(),
    queryFn: async () => {
      const result = await apiCall<CourseStats[]>(
        "GET",
        profileEndpoints.GET_ALL_INSTRUCTOR_DASHBOARD_DETAILS_API
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });
}
