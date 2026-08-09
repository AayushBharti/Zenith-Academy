import type { CourseResponse, SectionResponse } from "@workspace/shared-types";
import { create } from "zustand";

interface ViewCourseState {
  courseSectionData: SectionResponse[];
  courseEntireData: CourseResponse | null;
  completedLectures: string[];
  totalNoOfLectures: number;
  setCourseSectionData: (data: SectionResponse[]) => void;
  setEntireCourseData: (data: CourseResponse) => void;
  setTotalNoOfLectures: (total: number) => void;
  setCompletedLectures: (lectures: string[]) => void;
  updateCompletedLectures: (lecture: string) => void;
}

const useViewCourseStore = create<ViewCourseState>((set) => ({
  courseSectionData: [],
  courseEntireData: null,
  completedLectures: [],
  totalNoOfLectures: 0,

  setCourseSectionData: (data) => set({ courseSectionData: data }),
  setEntireCourseData: (data) => set({ courseEntireData: data }),
  setTotalNoOfLectures: (total) => set({ totalNoOfLectures: total }),
  setCompletedLectures: (lectures) => set({ completedLectures: lectures }),
  updateCompletedLectures: (lecture) =>
    set((state) => ({
      completedLectures: [...state.completedLectures, lecture],
    })),
}));

export default useViewCourseStore;
