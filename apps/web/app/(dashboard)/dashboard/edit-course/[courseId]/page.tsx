import InstructorRoute from "@/features/auth/components/instructor-route";
import EditCourse from "@/features/course/components/edit-course";

export default function EditCoursePage() {
  return (
    <InstructorRoute>
      <EditCourse />
    </InstructorRoute>
  );
}
