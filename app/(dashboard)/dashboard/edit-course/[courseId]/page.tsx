import InstructorRoute from "@/components/Auth/InstructorRoute"
import EditCourse from "@/components/Dashboard/EditCourse/EditCourse"

export default function EditCoursePage() {
  return (
    <InstructorRoute>
      <EditCourse />
    </InstructorRoute>
  )
}
