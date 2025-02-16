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

import { cn } from "@/lib/utils"

const CourseTips = ({ className }: { className?: string }) => {
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
    <Card className={cn("xl:self-start xl:w-[400px]", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="size-5 text-lg text-yellow-500" />
          Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {courseUploadTips.map((tip, index) => (
            <li
              key={index}
              className="flex items-start text-muted-foreground gap-3"
            >
              <span className="mt-0.5">{tip.icon}</span>
              <span className="text-sm">{tip.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default CourseTips
