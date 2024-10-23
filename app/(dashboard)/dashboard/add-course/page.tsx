import React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { RenderSteps } from "@/components/Dashboard/AddCourse/RenderSteps"

const AddCourse = () => {
  return (
    <div className="mx-auto py-10">
      <div className="flex w-full items-start gap-x-6">
        <div className="flex flex-1 flex-col">
          <h1 className="text-3xl font-bold mb-8">Add Course</h1>
          <RenderSteps />
        </div>
        <Card className="sticky top-10 hidden max-w-[400px] flex-1 xl:block mr-10">
          <CardHeader>Course Upload Tips💡</CardHeader>
          <CardContent>
            <li>Set the Course Price option or make it free.</li>
            <li>Standard size for the course thumbnail is 1024x576.</li>
            <li>Video section controls the course overview video.</li>
            <li>Course Builder is where you create and organize a course.</li>
            <li>
              Add Topics in the Course Builder section to create lessons,
              quizzes, and assignments.
            </li>
            <li>
              Information from the Additional Data section shows up on the
              course single page.
            </li>
            <li>Make Announcements to notify any important</li>
            <li>Notes to all enrolled students at once.</li>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AddCourse
