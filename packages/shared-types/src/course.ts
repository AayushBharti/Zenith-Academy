import { z } from "zod";
import { userSummarySchema } from "./user";

// ========== Request Schemas ==========

// Course schemas
export const createCourseSchema = z.object({
  courseName: z.string(),
  courseDescription: z.string(),
  whatYouWillLearn: z.string(),
  price: z.coerce.number(),
  tag: z.string(),
  category: z.string(),
  instructions: z.string().optional(),
  status: z.string().optional(),
});
export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const getCourseDetailsSchema = z.object({
  courseId: z.string(),
});
export type GetCourseDetailsInput = z.infer<typeof getCourseDetailsSchema>;

export const editCourseSchema = z.object({
  courseId: z.string(),
  courseName: z.string().optional(),
  courseDescription: z.string().optional(),
  whatYouWillLearn: z.string().optional(),
  price: z.coerce.number().optional(),
  tag: z.string().optional(),
  category: z.string().optional(),
  instructions: z.string().optional(),
  status: z.string().optional(),
});
export type EditCourseInput = z.infer<typeof editCourseSchema>;

export const getFullCourseDetailsSchema = z.object({
  courseId: z.string(),
});
export type GetFullCourseDetailsInput = z.infer<typeof getFullCourseDetailsSchema>;

export const deleteCourseSchema = z.object({
  courseId: z.string(),
});
export type DeleteCourseInput = z.infer<typeof deleteCourseSchema>;

export const searchCourseSchema = z.object({
  searchQuery: z.string(),
});
export type SearchCourseInput = z.infer<typeof searchCourseSchema>;

export const markLectureAsCompleteSchema = z.object({
  courseId: z.string(),
  subSectionId: z.string(),
  userId: z.string(),
});
export type MarkLectureAsCompleteInput = z.infer<typeof markLectureAsCompleteSchema>;

// Category schemas
export const createCategorySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const categoryPageDetailsSchema = z.object({
  categoryId: z.string(),
});
export type CategoryPageDetailsInput = z.infer<typeof categoryPageDetailsSchema>;

export const addCourseToCategorySchema = z.object({
  courseId: z.string(),
  categoryId: z.string(),
});
export type AddCourseToCategoryInput = z.infer<typeof addCourseToCategorySchema>;

// Section schemas
export const createSectionSchema = z.object({
  sectionName: z.string(),
  courseId: z.string(),
});
export type CreateSectionInput = z.infer<typeof createSectionSchema>;

export const updateSectionSchema = z.object({
  sectionName: z.string(),
  sectionId: z.string(),
  courseId: z.string(),
});
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;

export const deleteSectionSchema = z.object({
  sectionId: z.string(),
  courseId: z.string(),
});
export type DeleteSectionInput = z.infer<typeof deleteSectionSchema>;

// SubSection schemas
export const createSubSectionSchema = z.object({
  sectionId: z.string(),
  title: z.string(),
  description: z.string(),
  courseId: z.string(),
});
export type CreateSubSectionInput = z.infer<typeof createSubSectionSchema>;

export const updateSubSectionSchema = z.object({
  SubsectionId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  courseId: z.string(),
});
export type UpdateSubSectionInput = z.infer<typeof updateSubSectionSchema>;

export const deleteSubSectionSchema = z.object({
  subSectionId: z.string(),
  sectionId: z.string(),
  courseId: z.string(),
});
export type DeleteSubSectionInput = z.infer<typeof deleteSubSectionSchema>;

// Rating and Review schemas
export const createRatingSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string(),
  courseId: z.string(),
});
export type CreateRatingInput = z.infer<typeof createRatingSchema>;

export const getAverageRatingSchema = z.object({
  courseId: z.string(),
});
export type GetAverageRatingInput = z.infer<typeof getAverageRatingSchema>;

// ========== Response Schemas ==========

export const subSectionResponseSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  videoUrl: z.string(),
  timeDuration: z.string().optional(),
});
export type SubSectionResponse = z.infer<typeof subSectionResponseSchema>;

export const sectionResponseSchema = z.object({
  _id: z.string(),
  sectionName: z.string(),
  subSection: z.array(subSectionResponseSchema),
});
export type SectionResponse = z.infer<typeof sectionResponseSchema>;

export const reviewResponseSchema = z.object({
  _id: z.string().optional(),
  rating: z.number(),
  review: z.string(),
  user: z
    .object({
      _id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      image: z.string(),
    })
    .optional(),
  course: z.string().optional(),
});
export type ReviewResponse = z.infer<typeof reviewResponseSchema>;

export const categoryResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  courses: z.array(z.unknown()).optional(),
});
export type CategoryResponse = z.infer<typeof categoryResponseSchema>;

export const courseResponseSchema = z.object({
  _id: z.string(),
  courseName: z.string(),
  courseDescription: z.string(),
  price: z.number(),
  thumbnail: z.string().optional(),
  instructor: userSummarySchema.optional(),
  ratingAndReviews: z.array(reviewResponseSchema).optional(),
  studentsEnrolled: z.array(z.string()).optional(),
  courseContent: z.array(sectionResponseSchema).optional(),
  whatYouWillLearn: z.string().optional(),
  instructions: z.array(z.string()).optional(),
  status: z.string().optional(),
  tag: z.array(z.string()).optional(),
  averageRating: z.number().optional(),
  category: z.union([z.string(), categoryResponseSchema]).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type CourseResponse = z.infer<typeof courseResponseSchema>;

export const fullCourseDetailsResponseSchema = z.object({
  courseDetails: courseResponseSchema,
  totalDuration: z.string(),
  completedVideos: z.array(z.string()),
});
export type FullCourseDetailsResponse = z.infer<
  typeof fullCourseDetailsResponseSchema
>;

const categoryWithCoursesSchema = categoryResponseSchema.extend({
  courses: z.array(courseResponseSchema).optional(),
});

export const categoryPageDetailsResponseSchema = z.object({
  selectedCategory: categoryWithCoursesSchema.optional(),
  selectedCourses: z.array(courseResponseSchema).optional(),
  differentCourses: z.array(courseResponseSchema).optional(),
  mostSellingCourses: z.array(courseResponseSchema).optional(),
});
export type CategoryPageDetailsResponse = z.infer<
  typeof categoryPageDetailsResponseSchema
>;

export const courseProgressSchema = z.object({
  course: z.string(),
  completedVideos: z.array(z.string()),
});
export type CourseProgress = z.infer<typeof courseProgressSchema>;

export const enrolledCoursesUserSchema = userSummarySchema.extend({
  courses: z.array(courseResponseSchema),
  courseProgress: z.array(courseProgressSchema),
});
export type EnrolledCoursesUser = z.infer<typeof enrolledCoursesUserSchema>;

export const courseStatsSchema = z.object({
  _id: z.string(),
  courseName: z.string(),
  courseDescription: z.string(),
  totalStudents: z.number(),
  totalRevenue: z.number(),
});
export type CourseStats = z.infer<typeof courseStatsSchema>;

export const averageRatingResponseSchema = z.object({
  averageRating: z.number(),
});
export type AverageRatingResponse = z.infer<typeof averageRatingResponseSchema>;
