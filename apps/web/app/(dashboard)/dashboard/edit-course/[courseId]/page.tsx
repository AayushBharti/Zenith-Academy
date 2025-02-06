import InstructorRoute from "@/components/auth/instructor-route"
import EditCourse from "@/components/dashboard/edit-course/edit-course"

export default function EditCoursePage() {
  return (
    <InstructorRoute>
      <EditCourse />
    </InstructorRoute>
  )
}
