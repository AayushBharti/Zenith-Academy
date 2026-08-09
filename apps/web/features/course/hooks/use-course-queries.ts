"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  CategoryResponse as Category,
  CourseResponse as Course,
  FullCourseDetailsResponse as FullCourseDetails,
} from "@workspace/shared-types";
import { apiCall } from "@/lib/api-call";
import { courseEndpoints } from "@/lib/apis";
import { queryKeys } from "@/lib/query-keys";

/** Fetch all published courses. */
export function useAllCourses() {
  return useQuery({
    queryKey: queryKeys.course.list(),
    queryFn: async () => {
      const result = await apiCall<Course[]>(
        "GET",
        courseEndpoints.GET_ALL_COURSE_API
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });
}

/** Fetch details for a single course. */
export function useCourseDetails(courseId: string) {
  return useQuery({
    queryKey: queryKeys.course.detail(courseId),
    queryFn: async () => {
      const result = await apiCall<Course>(
        "POST",
        courseEndpoints.COURSE_DETAILS_API,
        { courseId }
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    enabled: !!courseId,
  });
}

/** Fetch full course details including progress for the authenticated user. */
export function useFullCourseDetails(courseId: string) {
  return useQuery({
    queryKey: queryKeys.course.fullDetail(courseId),
    queryFn: async () => {
      const result = await apiCall<FullCourseDetails>(
        "POST",
        courseEndpoints.GET_FULL_COURSE_DETAILS_AUTHENTICATED,
        { courseId }
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    enabled: !!courseId,
  });
}

/** Fetch available course categories. */
export function useCourseCategories() {
  return useQuery({
    queryKey: queryKeys.course.categories(),
    queryFn: async () => {
      const result = await apiCall<Category[]>(
        "GET",
        courseEndpoints.COURSE_CATEGORIES_API
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });
}

/** Fetch all courses created by the authenticated instructor. */
export function useInstructorCourses() {
  return useQuery({
    queryKey: queryKeys.course.instructorCourses(),
    queryFn: async () => {
      const result = await apiCall<Course[]>(
        "GET",
        courseEndpoints.GET_ALL_INSTRUCTOR_COURSES_API
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });
}

/** Search courses by query string. */
export function useSearchCourses(query: string) {
  return useQuery({
    queryKey: queryKeys.course.search(query),
    queryFn: async () => {
      const result = await apiCall<Course[]>(
        "GET",
        `${courseEndpoints.SEARCH_COURSES_API}?query=${query}`
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    enabled: !!query,
  });
}
