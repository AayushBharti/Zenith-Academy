"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import useViewCourseStore from "@/store/use-view-course-store"
import { ChevronLeft, Star } from "lucide-react"

import { Section, SubSection } from "@/types/course"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

interface VideoDetailsSidebarProps {
  setReviewModal: (value: boolean) => void
}

export function VideoDetailsSidebar({
  setReviewModal,
}: VideoDetailsSidebarProps) {
  const [activeSubsectionId, setActiveSubsectionId] = useState<string>("")
  const router = useRouter()
  const { courseId, sectionId, subsectionId } = useParams()
  const { courseSectionData, completedLectures, totalNoOfLectures } =
    useViewCourseStore()

  useEffect(() => {
    if (!courseSectionData || !subsectionId) return

    setActiveSubsectionId(subsectionId as string)
  }, [courseSectionData, subsectionId])

  const navigateToSubsection = (sectionId: string, subsectionId: string) => {
    router.push(
      `/view-course/${courseId}/section/${sectionId}/sub-section/${subsectionId}`
    )
  }

  const completionPercentage =
    (completedLectures?.length / totalNoOfLectures) * 100

  return (
    <aside className="w-80 h-screen bg-background border-r flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/enrolled-courses")}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back to courses</span>
        </Button>
        <Button onClick={() => setReviewModal(true)}>
          <Star className="mr-2 h-4 w-4" />
          Review
        </Button>
      </div>
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-2">Course Progress</h2>
        <Progress value={completionPercentage} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2">
          {completedLectures?.length} of {totalNoOfLectures} lectures completed
        </p>
      </div>
      <ScrollArea className="flex-grow">
        <Accordion
          type="multiple"
          defaultValue={courseSectionData?.map((section) => section._id) || []}
          className="w-full"
        >
          {courseSectionData?.map((section: Section) => (
            <AccordionItem key={section._id} value={section._id}>
              <AccordionTrigger className="px-4">
                {section.sectionName}
              </AccordionTrigger>
              <AccordionContent>
                {section.subSection.map((subSection: SubSection) => (
                  <div
                    key={subSection._id}
                    onClick={() =>
                      navigateToSubsection(section._id, subSection._id)
                    }
                    className={`flex items-center space-x-2 p-2 cursor-pointer ${
                      subSection._id === activeSubsectionId
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <Checkbox
                      checked={completedLectures?.includes(subSection._id)}
                      onCheckedChange={() => {}}
                    />
                    <span className="text-sm">{subSection.title}</span>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </aside>
  )
}
