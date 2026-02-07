/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Response } from "express";

import Category from "@/models/category-model";
import Course from "@/models/course-model";
import CourseProgress from "@/models/course-progress-model";
import Section from "@/models/section-model";
import SubSection from "@/models/sub-section-model";
import User from "@/models/user-model";
import { uploadImageToCloudinary } from "@/utils/image-uploader";
import { convertSecondsToDuration } from "@/utils/sec-to-duration";

// Function to create a new course
export const createCourse = async (req: any, res: Response) => {
  try {
    // Get user ID from request object
    const userId = req.user?.id;

    // Get all required fields from request body
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      instructions,
    } = req.body;
    // console.log(req.body);
    // console.log(req.files);
    let { status } = req.body;

    // Get thumbnail image from request files
    const thumbnail = req.files?.thumbnailImage;

    // Check if any of the required fields are missing
    if (
      !(
        courseName &&
        courseDescription &&
        whatYouWillLearn &&
        price &&
        tag &&
        category
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    if (!status || status === undefined) {
      status = "Draft";
    }
    // Check for instructor details
    const instructorDetails = await User.findOne({
      _id: userId,
      accountType: "Instructor",
    });

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    // Check if the category given is valid
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }

    // Upload the Thumbnail to Cloudinary
    const folderName = process.env.FOLDER_NAME;
    if (!folderName) {
      return res.status(404).json({
        success: false,
        message: "Invalid FOLDER_NAME in env",
      });
    }
    const thumbnailImage = await uploadImageToCloudinary(
      Array.isArray(thumbnail) ? thumbnail[0] : thumbnail,
      folderName
    );
    // console.log(thumbnailImage);
    // Create a new course with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status,
      instructions,
    });

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    // Add the new course to the Categories
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: (error as Error).message,
    });
  }
};

//getALlCourses
export const getAllCourses = async (req: any, res: Response) => {
  try {
    const allCourses = await Course.find(
      {},
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
      .exec();
    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: (error as Error).message,
    });
  }
};

//getCourseDetails
export const getCourseDetails = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const { courseId } = req.body;

    // Fetch course details with multiple levels of population
    const courseDetails = await Course.findById(courseId)
      .populate({ path: "instructor", populate: { path: "additionalDetails" } })
      .populate("category")
      .populate({
        // Only populate specific fields from user model in ratingAndReviews
        path: "ratingAndReviews",
        populate: {
          path: "user",
          select: "firstName lastName accountType image",
        },
      })
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();

    // Check if course details exist
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }

    // Return successful response with course data
    return res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(500).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: (error as Error).message,
    });
  }
};

// Function to get all courses of a particular instructor
export const getInstructorCourses = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    // Get user ID from request object (assuming it's added to req.user by some auth middleware)
    const userId: string = req.user.id;

    // Find all courses of the instructor
    const allCourses = await Course.find({ instructor: userId })
      .populate("instructor")
      .populate("ratingAndReviews")
      .exec();

    // Return all courses of the instructor
    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error: any) {
    // Handle any errors that occur during the fetching of the courses
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

// Edit Course Details
export const editCourse = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const { courseId } = req.body;
    const updates: { [key: string]: any } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME || "default_folder"
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (Object.hasOwn(updates, key)) {
        if (key === "tag" || key === "instructions") {
          (course as any)[key] = JSON.parse(updates[key]);
        } else {
          (course as any)[key] = updates[key];
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

    return res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get full course details
export const getFullCourseDetails = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const { courseId } = req.body;
    const userId: string = req.user.id;

    // Find course details and populate related fields
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

    // Get course progress
    const courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userID: userId,
    });

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // Calculate the total course duration
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content: any) => {
      content.subSection.forEach((subSection: any) => {
        const timeDurationInSeconds = Number.parseInt(
          subSection.timeDuration,
          10
        );
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos ?? ["none"],
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Course
export const deleteCourse = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const { courseId } = req.body;

    // Find the course to delete
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    // Delete course ID from Category
    await Category.findByIdAndUpdate(course?.category?._id, {
      $pull: { courses: courseId },
    });

    // Delete course ID from Instructor
    await User.findByIdAndUpdate(course?.instructor?._id, {
      $pull: { courses: courseId },
    });

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Search course by title, description, and tags array
export const searchCourse = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const { searchQuery } = req.body;

    // Search for courses based on title, description, or tags
    const courses = await Course.find({
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

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark lecture as completed
export const markLectureAsComplete = async (
  req: any,
  res: Response
): Promise<Response> => {
  const { courseId, subSectionId, userId } = req.body;
  if (!(courseId && subSectionId && userId)) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    // Check if the user has already marked this video as complete
    const progressAlreadyExists = await CourseProgress.findOne({
      userID: userId,
      courseID: courseId,
    });

    const completedVideos = progressAlreadyExists?.completedVideos || [];

    if (!completedVideos.includes(subSectionId)) {
      // Add the completed subSectionId to the user's progress
      await CourseProgress.findOneAndUpdate(
        { userID: userId, courseID: courseId },
        { $push: { completedVideos: subSectionId } }
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "Lecture already marked as complete",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lecture marked as complete",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
