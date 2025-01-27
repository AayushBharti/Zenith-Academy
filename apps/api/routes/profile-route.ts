import express from "express"

import {
  deleteAccount,
  getAllUserDetails,
  getEnrolledCourses,
  instructorDashboard,
  updateDisplayPicture,
  updateProfile,
} from "@/controllers/profile-controller"
import { auth, isInstructor } from "@/middlewares/auth-middlewares"
import { isDemo } from "@/middlewares/demo-middlewares"

const router = express.Router() // Create an express router

/**
 * DELETE /deleteProfile
 * Route to delete a user account. This is a sensitive action, so it's protected with authentication and the 'isDemo' middleware.
 */
router.delete("/deleteProfile", auth, isDemo, deleteAccount)

/**
 * PUT /updateProfile
 * Route to update user profile. This is protected with authentication and the 'isDemo' middleware.
 */
router.put("/updateProfile", auth, isDemo, updateProfile)

/**
 * GET /getUserDetails
 * Route to get the details of the logged-in user. This requires authentication.
 */
router.get("/getUserDetails", auth, getAllUserDetails)

/**
 * GET /getEnrolledCourses
 * Route to get all courses the logged-in user is enrolled in. This requires authentication.
 */
router.get("/getEnrolledCourses", auth, getEnrolledCourses)

/**
 * PUT /updateDisplayPicture
 * Route to update the user's display picture. This is protected with authentication and the 'isDemo' middleware.
 */
router.put("/updateDisplayPicture", auth, isDemo, updateDisplayPicture)

/**
 * GET /getInstructorDashboardDetails
 * Route to get the instructor's dashboard details. Only instructors can access this route.
 * Protected by both 'auth' and 'isInstructor' middleware.
 */
router.get(
  "/getInstructorDashboardDetails",
  auth,
  isInstructor,
  instructorDashboard
)

export default router
