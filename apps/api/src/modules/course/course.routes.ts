import express, { type Router } from "express";
import {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} from "@/shared/middlewares/auth-middlewares";
import * as CategoryController from "./controllers/category.controller";
// Import Controllers
import * as CourseController from "./controllers/course.controller";
import * as RatingAndReviewController from "./controllers/rating-and-review.controller";
import * as SectionController from "./controllers/section.controller";
import * as SubSectionController from "./controllers/sub-section.controller";

// Import Middlewares

import upload from "@/shared/middlewares/upload-file";

const router: Router = express.Router();

router.post(
  "/createCourse",
  auth,
  isInstructor,
  upload.single("thumbnailImage"),
  CourseController.createCourse
);
router.post("/addSection", auth, isInstructor, SectionController.createSection);
router.post(
  "/updateSection",
  auth,
  isInstructor,
  SectionController.updateSection
);
router.post(
  "/deleteSection",
  auth,
  isInstructor,
  SectionController.deleteSection
);
router.post(
  "/updateSubSection",
  auth,
  isInstructor,
  upload.single("videoFile"),
  SubSectionController.updateSubSection
);
router.post(
  "/deleteSubSection",
  auth,
  isInstructor,
  SubSectionController.deleteSubSection
);
router.post(
  "/addSubSection",
  auth,
  isInstructor,
  upload.single("videoFile"),
  SubSectionController.createSubSection
);
router.get("/getAllCourses", CourseController.getAllCourses);
router.post("/getCourseDetails", CourseController.getCourseDetails);
router.post(
  "/editCourse",
  auth,
  isInstructor,
  upload.single("thumbnailImage"),
  CourseController.editCourse
);
router.get(
  "/getInstructorCourses",
  auth,
  isInstructor,
  CourseController.getInstructorCourses
);
router.post(
  "/getFullCourseDetails",
  auth,
  CourseController.getFullCourseDetails
);
router.delete("/deleteCourse", auth, CourseController.deleteCourse);
router.post("/searchCourse", CourseController.searchCourse);
router.post(
  "/updateCourseProgress",
  auth,
  isStudent,
  CourseController.markLectureAsComplete
);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************

router.post(
  "/createCategory",
  auth,
  isAdmin,
  CategoryController.createCategory
);
router.get("/showAllCategories", CategoryController.showAllCategories);
router.post("/getCategoryPageDetails", CategoryController.categoryPageDetails);
router.post(
  "/addCourseToCategory",
  auth,
  isInstructor,
  CategoryController.addCourseToCategory
);

// ********************************************************************************************************
//                                      Rating and Review routes
// ********************************************************************************************************

router.post(
  "/createRating",
  auth,
  isStudent,
  RatingAndReviewController.createRating
);
router.get("/getAverageRating", RatingAndReviewController.getAverageRating);
router.get("/getReviews", RatingAndReviewController.getAllRating);

export default router; // Export the router for use in other parts of the application
