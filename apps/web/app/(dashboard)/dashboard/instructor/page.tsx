import InstructorRoute from "@/components/auth/instructor-route"
import InstructorDashboard from "@/components/dashboard/instructor/instructor-dashboard"

export default function InstructorDashboardPage() {
  return (
    <InstructorRoute>
      <InstructorDashboard />
    </InstructorRoute>
  )
}
