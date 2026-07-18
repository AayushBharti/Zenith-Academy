import type { UpdateProfileInput } from "@workspace/shared-types";
import env from "@/configs/env";
import User from "@/modules/auth/models/user.model";
import Course from "@/modules/course/models/course-model";
import { uploadToCloudinary } from "@/modules/upload/upload.service";
import { ApiError } from "@/shared/utils/api-error";
import Profile from "../models/profile.model";

export const updateProfile = async (
  userId: string,
  body: UpdateProfileInput
) => {
  const {
    dateOfBirth = "",
    about = "",
    contactNumber = "",
    firstName,
    lastName,
    gender = "",
  } = body;

  const userDetails = await User.findById(userId);
  if (!userDetails) {
    throw ApiError.notFound("User not found");
  }

  const profile = await Profile.findById(userDetails.additionalDetails);
  if (!profile) {
    throw ApiError.notFound("Profile not found");
  }

  userDetails.firstName = firstName || userDetails.firstName;
  userDetails.lastName = lastName || userDetails.lastName;
  profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
  profile.about = about || profile.about;
  profile.gender = gender || profile.gender;
  profile.contactNumber = contactNumber || profile.contactNumber;

  await profile.save();
  await userDetails.save();

  return { profile, userDetails };
};

export const deleteAccount = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  await Profile.findByIdAndDelete(user.additionalDetails);
  await User.findByIdAndDelete(userId);
};

export const getAllUserDetails = async (userId: string) => {
  const userDetails = await User.findById(userId)
    .populate("additionalDetails")
    .exec();
  if (!userDetails) {
    throw ApiError.notFound("User not found");
  }
  return userDetails;
};

export const getEnrolledCourses = async (userId: string) => {
  const user = await User.findById(userId)
    .populate({
      path: "courses",
      populate: {
        path: "courseContent",
      },
    })
    .populate("courseProgress")
    .exec();

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return user;
};

export const updateDisplayPicture = async (
  userId: string,
  image: Express.Multer.File
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const uploadDetails = await uploadToCloudinary(image.buffer, {
    folder: env.FOLDER_NAME,
  });

  const updatedImage = await User.findByIdAndUpdate(
    { _id: userId },
    { image: uploadDetails.url },
    { new: true }
  );

  return updatedImage;
};

export const instructorDashboard = async (userId: string) => {
  const allCourses = await Course.find({ instructor: userId });

  const courseStats = allCourses.map((course) => {
    const totalStudents = course.studentsEnrolled?.length ?? 0;
    const totalRevenue = totalStudents * (course.price ?? 0);
    return {
      _id: course._id,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      totalStudents,
      totalRevenue,
    };
  });

  return courseStats;
};
