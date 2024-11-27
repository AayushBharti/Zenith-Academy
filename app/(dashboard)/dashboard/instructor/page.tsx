import InstructorRoute from "@/components/Auth/InstructorRoute"
import InstructorDashboard from "@/components/Dashboard/Instructor/InstructorDashboard"

export default function InstructorDashboardPage() {
  return (
    <InstructorRoute>
      <InstructorDashboard />
    </InstructorRoute>
  )
}
