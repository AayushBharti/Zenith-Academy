"use client"

import React from "react"
import {
  Bell,
  BookOpen,
  DollarSign,
  Image,
  LayoutList,
  Lightbulb,
  StickyNote,
  Video,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RenderSteps } from "@/components/Dashboard/AddCourse/RenderSteps"

const AddCourse = () => {
  const courseUploadTips = [
    {
      icon: <DollarSign className="h-5 w-5" />,
      text: "Set the Course Price option or make it free.",
    },
    {
      icon: <Image className="h-5 w-5" />,
      text: "Standard size for the course thumbnail is 1024x576.",
    },
    {
      icon: <Video className="h-5 w-5" />,
      text: "Video section controls the course overview video.",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      text: "Course Builder is where you create and organize a course.",
    },
    {
      icon: <LayoutList className="h-5 w-5" />,
      text: "Add Topics in the Course Builder section to create lessons, quizzes, and assignments.",
    },
    {
      icon: <StickyNote className="h-5 w-5" />,
      text: "Information from the Additional Data section shows up on the course single page.",
    },
    {
      icon: <Bell className="h-5 w-5" />,
      text: "Make Announcements to notify any important notes to all enrolled students at once.",
    },
  ]

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
        <Card className="xl:sticky xl:top-10 xl:self-start xl:w-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Course Upload Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {courseUploadTips.map((tip, index) => (
                <li key={index} className="flex items-start text-muted-foreground gap-3">
                  <span className="mt-0.5">
                    {tip.icon}
                  </span>
                  <span>{tip.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AddCourse
