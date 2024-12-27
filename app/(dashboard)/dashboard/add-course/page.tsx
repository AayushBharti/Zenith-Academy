import { Card, CardContent } from "@/components/ui/card"
import { RenderSteps } from "@/components/Dashboard/AddCourse/RenderSteps"
import CourseTips from "@/components/Dashboard/CourseTips"

const AddCourse = () => {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-8">Add Course</h1>
          <Card>
            <CardContent className="p-6">
              <RenderSteps />
            </CardContent>
          </Card>
        </div>
        <CourseTips className="xl:sticky xl:top-10 xl:self-start h-full xl:mt-16" />
      </div>
    </div>
  )
}

export default AddCourse
