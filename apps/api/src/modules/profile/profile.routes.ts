import express, { type Router } from "express";
import { auth, isInstructor } from "@/shared/middlewares/auth-middlewares";
import upload from "@/shared/middlewares/upload-file";
import * as ProfileController from "./controllers/profile.controller";

const router: Router = express.Router();

router.delete("/deleteProfile", auth, ProfileController.deleteAccount);
router.put("/updateProfile", auth, ProfileController.updateProfile);
router.get("/getUserDetails", auth, ProfileController.getAllUserDetails);
router.get("/getEnrolledCourses", auth, ProfileController.getEnrolledCourses);
router.post(
  "/updateDisplayPicture",
  auth,
  upload.single("pfp"),
  ProfileController.updateDisplayPicture
);
router.get(
  "/getInstructorDashboardDetails",
  auth,
  isInstructor,
  ProfileController.instructorDashboard
);

export default router;
