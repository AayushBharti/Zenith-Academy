import type {
  CreateCourseInput,
  EditCourseInput,
} from "@workspace/shared-types";
import mongoose from "mongoose";
import env from "@/configs/env";
import User from "@/modules/auth/models/user.model";
import { uploadToCloudinary } from "@/modules/upload/upload.service";
import { ApiError } from "@/shared/utils/api-error";
import { convertSecondsToDuration } from "@/shared/utils/sec-to-duration";
import Category from "../models/category-model";
import Course from "../models/course-model";
import CourseProgress from "../models/course-progress-model";
import Section from "../models/section-model";
import SubSection from "../models/sub-section-model";

export const createCourse = async (
  userId: string,
  body: CreateCourseInput,
  thumbnail: Express.Multer.File
) => {
  const {
    courseName,
    courseDescription,
    whatYouWillLearn,
    price,
    tag,
    category,
    instructions,
    status,
  } = body;

  const instructorDetails = await User.findOne({
    _id: userId,
    accountType: "Instructor",
  });

  if (!instructorDetails) {
    throw ApiError.notFound("Instructor Details Not Found");
  }

  const categoryDetails = await Category.findById(category);
  if (!categoryDetails) {
    throw ApiError.notFound("Category Details Not Found");
  }

  const thumbnailImage = await uploadToCloudinary(thumbnail.buffer, {
    folder: env.FOLDER_NAME,
  });

  const newCourse = await Course.create({
    courseName,
    courseDescription,
    instructor: instructorDetails._id,
    whatYouWillLearn,
    price,
    tag,
    category: categoryDetails._id,
    thumbnail: thumbnailImage.url,
    status: status || "Draft",
    instructions,
  });

  await User.findByIdAndUpdate(
    { _id: instructorDetails._id },
    {
      $push: {
        courses: newCourse._id,
      },
    },
    { new: true }
  );

  await Category.findByIdAndUpdate(
    { _id: categoryDetails._id },
    {
      $push: {
        course: newCourse._id,
      },
    },
    { new: true }
  );

  return newCourse;
};

export const getAllCourses = async () => {
  const allCourses = await Course.find(
    {
      status: "Published",
      category: { $ne: null },
    },
    {
      courseName: true,
      price: true,
      thumbnail: true,
      instructor: true,
      ratingAndReviews: true,
      studentsEnrolled: true,
      status: true,
      category: true,
      createdAt: true,
    }
  )
    .populate("instructor")
    .populate("category")
    .populate("ratingAndReviews")
    .exec();
  return allCourses;
};

export const getCourseDetails = async (courseId: string) => {
  const courseDetails = await Course.findById(courseId)
    .populate({ path: "instructor", populate: { path: "additionalDetails" } })
    .populate("category")
    .populate({
      path: "ratingAndReviews",
      populate: {
        path: "user",
        select: "firstName lastName accountType image",
      },
    })
    .populate({ path: "courseContent", populate: { path: "subSection" } })
    .exec();

  if (!courseDetails) {
    throw ApiError.notFound("Course Not Found");
  }

  return courseDetails;
};

export const getInstructorCourses = async (userId: string) => {
  const allCourses = await Course.find({ instructor: userId })
    .populate("instructor")
    .populate("ratingAndReviews")
    .exec();

  return allCourses;
};

export const editCourse = async (
  courseId: string,
  updates: EditCourseInput,
  thumbnail?: Express.Multer.File
) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw ApiError.notFound("Course not found");
  }

  if (thumbnail) {
    const thumbnailImage = await uploadToCloudinary(thumbnail.buffer, {
      folder: env.FOLDER_NAME,
    });
    course.thumbnail = thumbnailImage.url;
  }

  for (const key in updates) {
    if (Object.hasOwn(updates, key)) {
      const updateValue = updates[key as keyof EditCourseInput];

      if (key === "tag" || key === "instructions") {
        if (typeof updateValue === "string") {
          (course as unknown as Record<string, unknown>)[key] =
            JSON.parse(updateValue);
        }
      } else {
        (course as unknown as Record<string, unknown>)[key] = updateValue;
      }
    }
  }

  await course.save();

  const updatedCourse = await Course.findOne({
    _id: courseId,
  })
    .populate({
      path: "instructor",
      populate: {
        path: "additionalDetails",
      },
    })
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec();

  return updatedCourse;
};

export const getFullCourseDetails = async (
  courseId: string,
  userId: string
) => {
  const courseDetails = await Course.findOne({ _id: courseId })
    .populate({
      path: "instructor",
      populate: {
        path: "additionalDetails",
      },
    })
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec();

  const courseProgressCount = await CourseProgress.findOne({
    course: courseId,
    user: userId,
  });

  if (!courseDetails) {
    throw ApiError.notFound(`Could not find course with id: ${courseId}`);
  }

  let totalDurationInSeconds = 0;
  (
    courseDetails.courseContent as unknown as {
      subSection: { timeDuration: string }[];
    }[]
  ).forEach((content) => {
    content.subSection.forEach((subSection) => {
      const timeDurationInSeconds = Number.parseInt(
        subSection.timeDuration,
        10
      );
      totalDurationInSeconds += timeDurationInSeconds;
    });
  });

  const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

  return {
    courseDetails,
    totalDuration,
    completedVideos: courseProgressCount?.completedVideos ?? [],
  };
};

export const deleteCourse = async (courseId: string) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw ApiError.notFound("Course not found");
  }

  const studentsEnrolled = course.studentsEnrolled;
  for (const studentId of studentsEnrolled) {
    await User.findByIdAndUpdate(studentId, {
      $pull: { courses: courseId },
    });
  }

  const courseSections = course.courseContent;
  for (const sectionId of courseSections) {
    const section = await Section.findById(sectionId);
    if (section) {
      const subSections = section.subSection;
      for (const subSectionId of subSections) {
        await SubSection.findByIdAndDelete(subSectionId);
      }
    }

    await Section.findByIdAndDelete(sectionId);
  }

  await Course.findByIdAndDelete(courseId);

  await Category.findByIdAndUpdate(course?.category?._id, {
    $pull: { courses: courseId },
  });

  await User.findByIdAndUpdate(course?.instructor?._id, {
    $pull: { courses: courseId },
  });
};

export const searchCourse = async (searchQuery: string) => {
  const courses = await Course.find({
    status: "Published",
    category: { $ne: null },
    $or: [
      { courseName: { $regex: searchQuery, $options: "i" } },
      { courseDescription: { $regex: searchQuery, $options: "i" } },
      { tag: { $regex: searchQuery, $options: "i" } },
    ],
  })
    .populate("instructor")
    .populate("category")
    .populate("ratingAndReviews")
    .exec();

  return courses;
};

export const markLectureAsComplete = async (
  courseId: string,
  subSectionId: string,
  userId: string
) => {
  const progressAlreadyExists = await CourseProgress.findOne({
    user: userId,
    course: courseId,
  });

  const completedVideos = progressAlreadyExists?.completedVideos || [];

  if (!completedVideos.includes(new mongoose.Types.ObjectId(subSectionId))) {
    await CourseProgress.findOneAndUpdate(
      { user: userId, course: courseId },
      { $push: { completedVideos: new mongoose.Types.ObjectId(subSectionId) } }
    );
  } else {
    throw ApiError.conflict("Lecture already marked as complete");
  }
};
