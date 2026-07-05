import type {
  CreateSectionInput,
  DeleteSectionInput,
  UpdateSectionInput,
} from "@workspace/shared-types";
import { ApiError } from "@/shared/utils/api-error";
import Course from "../models/course-model";
import Section from "../models/section-model";

export const createSection = async (body: CreateSectionInput) => {
  const { sectionName, courseId } = body;

  const course = await Course.findById(courseId);
  if (!course) {
    throw ApiError.notFound("Course not found");
  }

  const newSection = await Section.create({ sectionName });

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    {
      $push: {
        courseContent: newSection._id,
      },
    },
    { new: true }
  )
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec();

  return updatedCourse;
};

export const updateSection = async (body: UpdateSectionInput) => {
  const { sectionName, sectionId, courseId } = body;

  const section = await Section.findByIdAndUpdate(
    sectionId,
    { sectionName },
    { new: true }
  );
  if (!section) {
    throw ApiError.notFound("Section not found");
  }

  const updatedCourse = await Course.findById(courseId)
    .populate({
      path: "courseContent",
      populate: { path: "subSection" },
    })
    .exec();

  return updatedCourse;
};

export const deleteSection = async (body: DeleteSectionInput) => {
  const { sectionId, courseId } = body;
  await Section.findByIdAndDelete(sectionId);
  const updatedCourse = await Course.findById(courseId)
    .populate({
      path: "courseContent",
      populate: { path: "subSection" },
    })
    .exec();
  return updatedCourse;
};
