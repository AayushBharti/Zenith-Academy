import { RenderSteps } from "@/features/course/components/render-steps";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";

const AddCourse = () => (
  <div className="container space-y-8 p-4 md:p-8">
    <DashboardPageHeader
      description="Fill out the details below to create your new course."
      title="Add New Course"
    />
    <RenderSteps />
  </div>
);

export default AddCourse;
