"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { markLectureAsComplete } from "@/services/courseDetailsService"
import { useAuthStore } from "@/store/useAuthStore"
import { useProfileStore } from "@/store/useProfileStore"
import useViewCourseStore from "@/store/useViewCourseStore"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"

import { Section, SubSection } from "@/types/course"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function VideoDetails() {
  const { courseId, sectionId, subsectionId } = useParams()
  const router = useRouter()
  const { token } = useAuthStore()
  const { user } = useProfileStore()
  const { courseSectionData, completedLectures, setCompletedLectures } =
    useViewCourseStore()

  const [videoData, setVideoData] = useState<SubSection | null>(null)
  const [videoEnded, setVideoEnded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const currentVideo = courseSectionData
      .flatMap((section: Section) => section.subSection)
      .find((subsection: SubSection) => subsection._id === subsectionId)

    setVideoData(currentVideo || null)
    setVideoEnded(false)
  }, [courseSectionData, subsectionId])

  const currentIndices = courseSectionData.reduce(
    (acc, section: Section, sIndex) => {
      const subIndex = section.subSection.findIndex(
        (sub: SubSection) => sub._id === subsectionId
      )
      return subIndex !== -1 ? { sIndex, subIndex } : acc
    },
    { sIndex: -1, subIndex: -1 }
  )

  const isFirstLecture =
    currentIndices.sIndex === 0 && currentIndices.subIndex === 0

  const isLastLecture =
    currentIndices.sIndex === courseSectionData.length - 1 &&
    currentIndices.subIndex ===
      courseSectionData[currentIndices.sIndex]?.subSection?.length - 1

  const navigateToLecture = (direction: "next" | "previous") => {
    let { sIndex, subIndex } = currentIndices

    if (direction === "next" && !isLastLecture) {
      subIndex++
      if (subIndex === courseSectionData[sIndex].subSection.length) {
        sIndex++
        subIndex = 0
      }
    } else if (direction === "previous" && !isFirstLecture) {
      subIndex--
      if (subIndex < 0) {
        sIndex--
        subIndex = courseSectionData[sIndex].subSection.length - 1
      }
    }

    const nextSubsection = courseSectionData[sIndex].subSection[subIndex]
    router.push(
      `/view-course/${courseId}/section/${courseSectionData[sIndex]._id}/sub-section/${nextSubsection._id}`
    )
  }

  const handleLectureCompletion = async () => {
    if (!user?._id || !videoData) return

    const res = await markLectureAsComplete(
      {
        userId: user._id,
        courseId: courseId as string,
        subSectionId: subsectionId as string,
      },
      token as string
    )
    if (res) {
      setCompletedLectures([...completedLectures, videoData._id])
      console.log("lecture completed", completedLectures)
    }
  }

  const replayVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setVideoEnded(false)
    }
  }

  if (!videoData) {
    return <div className="size-full grid place-items-center">Loading...</div>
  }

  return (
    <div className="w-full">
      <span className="font-bold text-xl">{videoData.title}</span>

      <Card className="relative aspect-video mr-8 my-6">
        <video
          ref={videoRef}
          className="w-full h-full"
          src={videoData.videoUrl}
          controls
          onEnded={() => setVideoEnded(true)}
        />
        {videoEnded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="space-x-4">
              <Button
                onClick={() => navigateToLecture("previous")}
                disabled={isFirstLecture}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>

              {!completedLectures.includes(videoData._id) && (
                <Button onClick={handleLectureCompletion}>
                  Mark as Completed
                </Button>
              )}

              <Button onClick={replayVideo}>
                <RotateCcw className="mr-2 h-4 w-4" /> Replay
              </Button>

              <Button
                onClick={() => navigateToLecture("next")}
                disabled={isLastLecture}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
      <div>
        <h3 className="text-lg font-semibold">Description</h3>
        <p className="my-1 text-muted-foreground">{videoData.description}</p>
      </div>
    </div>
  )
}
