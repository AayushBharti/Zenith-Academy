import type { CourseDetails } from "./course";

export interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  courses: CourseDetails[];
}
