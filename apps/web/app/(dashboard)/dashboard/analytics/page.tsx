import InstructorRoute from "@/features/auth/components/instructor-route";
import InstructorDashboard from "@/features/dashboard/components/instructor-dashboard";

export default function InstructorDashboardPage() {
  return (
    <InstructorRoute>
      <InstructorDashboard />
    </InstructorRoute>
  );
}
