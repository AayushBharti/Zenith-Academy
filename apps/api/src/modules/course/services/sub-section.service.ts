import type {
  CreateSubSectionInput,
  DeleteSubSectionInput,
  UpdateSubSectionInput,
} from "@workspace/shared-types";
import env from "@/configs/env";
import { uploadToCloudinary } from "@/modules/upload/upload.service";
import { ApiError } from "@/shared/utils/api-error";
import Course from "../models/course-model";
import Section from "../models/section-model";
import SubSection from "../models/sub-section-model";

export const createSubSection = async (
  body: CreateSubSectionInput,
  video: Express.Multer.File
) => {
  const { sectionId, title, description, courseId } = body;

  const section = await Section.findById(sectionId);
  if (!section) {
    throw ApiError.notFound("Section not found.");
  }

  const uploadDetails = await uploadToCloudinary(video.buffer, {
    folder: env.FOLDER_VIDEO,
    resource_type: "video",
  });

  const SubSectionDetails = await SubSection.create({
    title,
    description,
    videoUrl: uploadDetails.url,
  });

  await Section.findByIdAndUpdate(
    { _id: sectionId },
    { $push: { subSection: SubSectionDetails._id } },
    { new: true }
  ).populate("subSection");

  const updatedCourse = await Course.findById(courseId)
    .populate({ path: "courseContent", populate: { path: "subSection" } })
    .exec();

  return updatedCourse;
};

export const updateSubSection = async (
  body: UpdateSubSectionInput,
  video?: Express.Multer.File
) => {
  const { SubsectionId, title, description, courseId } = body;

  const subSection = await SubSection.findById(SubsectionId);
  if (!subSection) {
    throw ApiError.notFound("Sub-section not found.");
  }

  if (video) {
    const uploadDetails = await uploadToCloudinary(video.buffer, {
      folder: env.FOLDER_VIDEO,
      resource_type: "video",
    });
    subSection.videoUrl = uploadDetails.url;
  }

  if (title) subSection.title = title;
  if (description) subSection.description = description;

  await subSection.save();

  const updatedCourse = await Course.findById(courseId)
    .populate({ path: "courseContent", populate: { path: "subSection" } })
    .exec();

  return updatedCourse;
};

export const deleteSubSection = async (body: DeleteSubSectionInput) => {
  const { subSectionId, sectionId, courseId } = body;

  const ifSubSection = await SubSection.findById(subSectionId);
  if (!ifSubSection) {
    throw ApiError.notFound("Sub-section not found");
  }

  const ifSection = await Section.findById(sectionId);
  if (!ifSection) {
    throw ApiError.notFound("Section not found");
  }

  await SubSection.findByIdAndDelete(subSectionId);

  await Section.findByIdAndUpdate(
    sectionId,
    { $pull: { subSection: subSectionId } },
    { new: true }
  );

  const updatedCourse = await Course.findById(courseId)
    .populate({ path: "courseContent", populate: { path: "subSection" } })
    .exec();

  return updatedCourse;
};
