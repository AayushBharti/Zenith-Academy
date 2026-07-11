import type { Request, Response } from "express";
import { ApiError } from "@/shared/utils/api-error";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";
import {
  deleteCourseSchema,
  getCourseDetailsSchema,
  getFullCourseDetailsSchema,
  markLectureAsCompleteSchema,
  searchCourseSchema,
} from "@workspace/shared-types";
import * as CourseService from "../services/course.service";

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { body, file } = req;
    if (!file) {
      throw ApiError.badRequest("Thumbnail image is required.");
    }
    const parsedBody = { ...body, price: Number(body.price) };
    const newCourse = await CourseService.createCourse(
      req.user.id,
      parsedBody,
      file
    );
    return ApiResponse.created(res, "Course Created Successfully", newCourse);
  }
);

export const getAllCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const allCourses = await CourseService.getAllCourses();
    return ApiResponse.ok(
      res,
      "Data for all courses fetched successfully",
      allCourses
    );
  }
);

export const getCourseDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = getCourseDetailsSchema.parse(req.body);
    const courseDetails = await CourseService.getCourseDetails(courseId);
    return ApiResponse.ok(res, "Course fetched successfully", courseDetails);
  }
);

export const getInstructorCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const allCourses = await CourseService.getInstructorCourses(req.user.id);
    return ApiResponse.ok(
      res,
      "Instructor courses fetched successfully",
      allCourses
    );
  }
);

export const editCourse = asyncHandler(async (req: Request, res: Response) => {
  const { body, file } = req;
  const { courseId, ...updates } = body;
  if (updates.price) {
    updates.price = Number(updates.price);
  }
  const updatedCourse = await CourseService.editCourse(courseId, updates, file);
  return ApiResponse.ok(res, "Course updated successfully", updatedCourse);
});

export const getFullCourseDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = getFullCourseDetailsSchema.parse(req.body);
    const courseDetails = await CourseService.getFullCourseDetails(
      courseId,
      req.user.id
    );
    return ApiResponse.ok(
      res,
      "Full course details fetched successfully",
      courseDetails
    );
  }
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = deleteCourseSchema.parse(req.body);
    await CourseService.deleteCourse(courseId);
    return ApiResponse.ok(res, "Course deleted successfully");
  }
);

export const searchCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { searchQuery } = searchCourseSchema.parse(req.body);
    const courses = await CourseService.searchCourse(searchQuery);
    return ApiResponse.ok(res, "Courses searched successfully", courses);
  }
);

export const markLectureAsComplete = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId, subSectionId, userId } =
      markLectureAsCompleteSchema.parse(req.body);
    await CourseService.markLectureAsComplete(courseId, subSectionId, userId);
    return ApiResponse.ok(res, "Lecture marked as complete");
  }
);
