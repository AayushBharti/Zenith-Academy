import { RenderSteps } from "@/components/dashboard/add-course/render-steps";
import { Card, CardContent } from "@/components/ui/card";

const AddCourse = () => {
  return (
    <div className="">
      <div className="flex flex-col gap-8 xl:flex-row">
        <div className="flex-1">
          <h1 className="mb-8 font-bold text-3xl">Add Course</h1>
          <Card>
            <CardContent className="p-6">
              <RenderSteps />
            </CardContent>
          </Card>
        </div>
        {/* <CourseTips className="xl:sticky xl:top-10 xl:self-start h-full xl:mt-16" /> */}
      </div>
    </div>
  );
};

export default AddCourse;
