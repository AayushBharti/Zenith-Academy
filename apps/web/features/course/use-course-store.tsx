import type { CourseResponse } from "@workspace/shared-types";
import { create } from "zustand";

/** Course editing state — payment loading is owned by TanStack Query mutations. */
interface CourseState {
  step: number;
  course: CourseResponse | null;
  editCourse: boolean;
  setStep: (newStep: number) => void;
  setCourse: (newCourse: CourseResponse) => void;
  setEditCourse: (isEditing: boolean) => void;
  resetCourseState: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  step: 1,
  course: null,
  editCourse: false,

  setStep: (newStep) => set({ step: newStep }),
  setCourse: (newCourse) => set({ course: newCourse }),
  setEditCourse: (isEditing) => set({ editCourse: isEditing }),
  resetCourseState: () =>
    set({
      step: 1,
      course: null,
      editCourse: false,
    }),
}));

export default useCourseStore;
