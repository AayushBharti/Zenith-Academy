import express from "express"

import {
  addCourseToCategory,
  categoryPageDetails,
  createCategory,
  showAllCategories,
} from "@/controllers/category-controller"
// Import Controllers
import {
  createCourse,
  deleteCourse,
  editCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  getInstructorCourses,
  markLectureAsComplete,
  searchCourse,
} from "@/controllers/course-controller"
import {
  createRating,
  getAllRating,
  getAverageRating,
} from "@/controllers/rating-and-review-controller"
import {
  createSection,
  deleteSection,
  updateSection,
} from "@/controllers/section-controller"
import {
  createSubSection,
  deleteSubSection,
  updateSubSection,
} from "@/controllers/sub-section-controller"
import {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} from "@/middlewares/auth-middlewares"
// Import Middlewares
import { isDemo } from "@/middlewares/demo-middlewares"

const router = express.Router()

/**
 * Create a new course.
 * Accessible only by instructors.
 */
router.post("/createCourse", auth, isInstructor, isDemo, createCourse)

/**
 * Add a section to a course.
 * Accessible only by instructors.
 */
router.post("/addSection", auth, isInstructor, createSection)

/**
 * Update an existing section.
 * Accessible only by instructors.
 */
router.post("/updateSection", auth, isInstructor, updateSection)

/**
 * Delete a section from a course.
 * Accessible only by instructors.
 */
router.post("/deleteSection", auth, isInstructor, isDemo, deleteSection)

/**
 * Update an existing subsection.
 * Accessible only by instructors.
 */
router.post("/updateSubSection", auth, isInstructor, updateSubSection)

/**
 * Delete a subsection from a section.
 * Accessible only by instructors.
 */
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)

/**
 * Add a subsection to a section.
 * Accessible only by instructors.
 */
router.post("/addSubSection", auth, isInstructor, createSubSection)

/**
 * Get all courses.
 * Accessible by everyone.
 */
router.get("/getAllCourses", getAllCourses)

/**
 * Get details for a specific course.
 * Accessible by authorized users.
 */
router.post("/getCourseDetails", getCourseDetails)

/**
 * Edit an existing course.
 * Accessible only by instructors.
 */
router.post("/editCourse", auth, isInstructor, isDemo, editCourse)

/**
 * Get all courses of a specific instructor.
 * Accessible only by instructors.
 */
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)

/**
 * Get full details of a course, including sections and subsections.
 * Accessible by authenticated users.
 */
router.post("/getFullCourseDetails", auth, getFullCourseDetails)

/**
 * Delete a course.
 * Accessible only by instructors.
 */
router.delete("/deleteCourse", auth, isDemo, deleteCourse)

/**
 * Search for courses.
 * Accessible by everyone.
 */
router.post("/searchCourse", searchCourse)

/**
 * Mark a lecture as complete for a student.
 * Accessible only by students.
 */
router.post("/updateCourseProgress", auth, isStudent, markLectureAsComplete)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************

/**
 * Create a new category.
 * Accessible only by admins.
 */
router.post("/createCategory", auth, isAdmin, createCategory)

/**
 * Get all categories.
 * Accessible by everyone.
 */
router.get("/showAllCategories", showAllCategories)

/**
 * Get category page details.
 * Accessible by everyone.
 */
router.post("/getCategoryPageDetails", categoryPageDetails)

/**
 * Add a course to a category.
 * Accessible only by instructors.
 */
router.post("/addCourseToCategory", auth, isInstructor, addCourseToCategory)

// ********************************************************************************************************
//                                      Rating and Review routes
// ********************************************************************************************************

/**
 * Create a rating for a course.
 * Accessible only by students.
 */
router.post("/createRating", auth, isStudent, isDemo, createRating)

/**
 * Get the average rating for a course.
 * Accessible by everyone.
 */
router.get("/getAverageRating", getAverageRating)

/**
 * Get all reviews for a course.
 * Accessible by everyone.
 */
router.get("/getReviews", getAllRating)

export default router // Export the router for use in other parts of the application
