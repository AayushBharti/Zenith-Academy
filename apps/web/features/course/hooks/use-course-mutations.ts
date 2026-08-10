"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CourseResponse as Course } from "@workspace/shared-types";
import { toast } from "sonner";
import { apiCall } from "@/lib/api-call";
import { courseEndpoints } from "@/lib/apis";
import { queryKeys } from "@/lib/query-keys";

/** Create a new course with the given details. */
export function useAddCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData | Record<string, unknown>) => {
      const result = await apiCall<Course>(
        "POST",
        courseEndpoints.CREATE_COURSE_API,
        data
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Course created");
      queryClient.invalidateQueries({
        queryKey: queryKeys.course.instructorCourses(),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Update existing course details. */
export function useEditCourse() {
  return useMutation({
    mutationFn: async (data: FormData | Record<string, unknown>) => {
      const result = await apiCall<Course>(
        "POST",
        courseEndpoints.EDIT_COURSE_API,
        data
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Course updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Create a new section in a course. */
export function useCreateSection() {
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const result = await apiCall<Course>(
        "POST",
        courseEndpoints.CREATE_SECTION_API,
        data
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Section created");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Update an existing section. */
export function useUpdateSection() {
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const result = await apiCall<Course>(
        "POST",
        courseEndpoints.UPDATE_SECTION_API,
        data
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Section updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Create a new sub-section (lecture) in a section. */
export function useCreateSubSection() {
  return useMutation({
    mutationFn: async (data: FormData | Record<string, unknown>) => {
      const result = await apiCall<Course>(
        "POST",
        courseEndpoints.CREATE_SUBSECTION_API,
        data
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Lecture created");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Update an existing sub-section (lecture). */
export function useUpdateSubSection() {
  return useMutation({
    mutationFn: async (data: FormData | Record<string, unknown>) => {
      const result = await apiCall<Course>(
        "POST",
        courseEndpoints.UPDATE_SUBSECTION_API,
        data
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Lecture updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Delete a section from a course. */
export function useDeleteSection() {
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const result = await apiCall<Course>(
        "POST",
        courseEndpoints.DELETE_SECTION_API,
        data
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Section deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Delete a sub-section (lecture) from a section. */
export function useDeleteSubSection() {
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const result = await apiCall<Course>(
        "POST",
        courseEndpoints.DELETE_SUBSECTION_API,
        data
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Lecture deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Delete a course by ID. */
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const result = await apiCall<void>(
        "DELETE",
        courseEndpoints.DELETE_COURSE_API,
        data
      );
      if (!result.ok) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Course deleted");
      queryClient.invalidateQueries({
        queryKey: queryKeys.course.instructorCourses(),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Mark a lecture as complete for the authenticated user. */
export function useMarkLectureComplete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const result = await apiCall<void>(
        "POST",
        courseEndpoints.LECTURE_COMPLETION_API,
        data
      );
      if (!result.ok) throw new Error(result.error);
    },
    onSuccess: (_data, variables) => {
      toast.success("Lecture completed");
      const courseId = variables.courseId as string;
      if (courseId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.course.fullDetail(courseId),
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Submit a rating and review for a course. */
export function useCreateRating() {
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const result = await apiCall<void>(
        "POST",
        courseEndpoints.CREATE_RATING_API,
        data
      );
      if (!result.ok) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Rating submitted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Add an existing course to a category. */
export function useAddCourseToCategory() {
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const result = await apiCall<void>(
        "POST",
        courseEndpoints.ADD_COURSE_TO_CATEGORY_API,
        data
      );
      if (!result.ok) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Course added to category");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Create a new course category. */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const result = await apiCall<void>(
        "POST",
        courseEndpoints.CREATE_CATEGORY_API,
        data
      );
      if (!result.ok) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({
        queryKey: queryKeys.course.categories(),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
