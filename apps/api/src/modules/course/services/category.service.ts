import type {
  AddCourseToCategoryInput,
  CategoryPageDetailsInput,
  CreateCategoryInput,
} from "@workspace/shared-types";
import mongoose from "mongoose";
import { ApiError } from "@/shared/utils/api-error";
import Category from "../models/category-model";
import Course from "../models/course-model";

function generateSlug(name: string): string {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const createCategory = async (body: CreateCategoryInput) => {
  const { name, description } = body;

  const slug = generateSlug(name);

  const existingCategory = await Category.findOne({ slug });
  if (existingCategory) {
    throw ApiError.conflict("Category already exists");
  }

  const CategorysDetails = await Category.create({
    name,
    description,
    slug,
  });

  return CategorysDetails;
};

export const showAllCategories = async () => {
  const allCategories = await Category.find(
    {},
    { name: true, description: true, slug: true }
  );
  return allCategories;
};

export const categoryPageDetails = async (body: CategoryPageDetailsInput) => {
  const { categoryId } = body;

  const selectedCategory = await Category.findById(categoryId)
    .populate({
      path: "courses",
      match: { status: "Published" },
      populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
    })
    .exec();

  if (!selectedCategory) {
    throw ApiError.notFound("Category not found");
  }

  if (selectedCategory.courses.length === 0) {
    throw ApiError.notFound("No courses found for the selected category.");
  }

  const selectedCourses = selectedCategory.courses;

  const categoriesExceptSelected = await Category.find({
    _id: { $ne: categoryId },
  }).populate({
    path: "courses",
    match: { status: "Published" },
    populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
  });

  const differentCourses: unknown[] = [];
  categoriesExceptSelected.forEach((category) => {
    differentCourses.push(...category.courses);
  });

  const allCategories = await Category.find().populate({
    path: "courses",
    match: { status: "Published" },
    populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
  });

  const allCourses = allCategories.flatMap((category) => category.courses);

  const mostSellingCourses = allCourses.slice(0, 10);

  return {
    selectedCategory,
    selectedCourses,
    differentCourses,
    mostSellingCourses,
  };
};

export const addCourseToCategory = async (body: AddCourseToCategoryInput) => {
  const { courseId, categoryId } = body;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw ApiError.notFound("Category not found");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw ApiError.notFound("Course not found");
  }

  if (category.courses.includes(new mongoose.Types.ObjectId(courseId))) {
    return;
  }

  category.courses.push(new mongoose.Types.ObjectId(courseId));
  await category.save();
};
