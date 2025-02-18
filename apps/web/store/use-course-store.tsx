import { create } from "zustand"

interface CourseState {
  step: number
  course: any | null
  editCourse: boolean
  paymentLoading: boolean
  setStep: (newStep: number) => void
  setCourse: (newCourse: any) => void
  setEditCourse: (isEditing: boolean) => void
  setPaymentLoading: (isLoading: boolean) => void
  resetCourseState: () => void
}

export const useCourseStore = create<CourseState>((set) => ({
  step: 1,
  course: null,
  editCourse: false,
  paymentLoading: false,

  setStep: (newStep) => set({ step: newStep }),
  setCourse: (newCourse) => set({ course: newCourse }),
  setEditCourse: (isEditing) => set({ editCourse: isEditing }),
  setPaymentLoading: (isLoading) => set({ paymentLoading: isLoading }),
  resetCourseState: () =>
    set({
      step: 1,
      course: null,
      editCourse: false,
    }),
}))

export default useCourseStore
