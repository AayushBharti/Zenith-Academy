"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { markLectureAsComplete } from "@/services/course-details-service";
import { useAuthStore } from "@/store/use-auth-store";
import { useProfileStore } from "@/store/use-profile-store";
import useViewCourseStore from "@/store/use-view-course-store";
import type { Section, SubSection } from "@/types/course";

export function VideoDetails() {
  const { courseId, subsectionId } = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const { user } = useProfileStore();
  const { courseSectionData, completedLectures, setCompletedLectures } =
    useViewCourseStore();

  const [videoData, setVideoData] = useState<SubSection | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!courseSectionData.length) return;

    const currentVideo = courseSectionData
      .flatMap((section: Section) => section.subSection)
      .find((subsection: SubSection) => subsection._id === subsectionId);

    setVideoData(currentVideo || null);
    setVideoEnded(false);
  }, [courseSectionData, subsectionId]);

  const currentIndices = courseSectionData.reduce(
    (acc, section: Section, sIndex) => {
      const subIndex = section.subSection.findIndex(
        (sub: SubSection) => sub._id === subsectionId
      );
      return subIndex !== -1 ? { sIndex, subIndex } : acc;
    },
    { sIndex: -1, subIndex: -1 }
  );

  const isFirstLecture =
    currentIndices.sIndex === 0 && currentIndices.subIndex === 0;

  const isLastLecture =
    currentIndices.sIndex === courseSectionData.length - 1 &&
    currentIndices.subIndex ===
      courseSectionData[currentIndices.sIndex]?.subSection?.length - 1;

  const navigateToLecture = (direction: "next" | "previous") => {
    let { sIndex, subIndex } = currentIndices;

    if (direction === "next" && !isLastLecture) {
      subIndex++;
      if (subIndex === courseSectionData[sIndex].subSection.length) {
        sIndex++;
        subIndex = 0;
      }
    } else if (direction === "previous" && !isFirstLecture) {
      subIndex--;
      if (subIndex < 0) {
        sIndex--;
        subIndex = courseSectionData[sIndex].subSection.length - 1;
      }
    }

    const nextSubsection = courseSectionData[sIndex].subSection[subIndex];
    router.push(
      `/view-course/${courseId}/section/${courseSectionData[sIndex]._id}/sub-section/${nextSubsection._id}`
    );
  };

  const handleLectureCompletion = async () => {
    if (!(user?._id && videoData)) return;
    setLoading(true);

    try {
      const res = await markLectureAsComplete(
        {
          userId: user._id,
          courseId: courseId as string,
          subSectionId: subsectionId as string,
        },
        token as string
      );
      if (res) {
        setCompletedLectures([...completedLectures, videoData._id]);
      }
    } finally {
      setLoading(false);
    }
  };

  const replayVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setVideoEnded(false);
    }
  };

  if (!videoData) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p>Loading lesson content...</p>
      </div>
    );
  }

  const isCompleted = completedLectures.includes(videoData._id);

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl tracking-tight">
            {videoData.title}
          </h1>
          {isCompleted && (
            <Badge
              className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
              variant="secondary"
            >
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          Lesson {currentIndices.subIndex + 1} of Section{" "}
          {currentIndices.sIndex + 1}
        </p>
      </div>

      {/* Video Player Card */}
      <Card className="overflow-hidden border-0 bg-black/95 shadow-xl ring-1 ring-white/10">
        <div className="relative aspect-video w-full">
          <video
            className="h-full w-full object-contain"
            controls
            onEnded={() => setVideoEnded(true)}
            ref={videoRef}
            src={videoData.videoUrl}
            // poster={videoData.thumbnail || ""}
          />

          {/* Video Ended Overlay */}
          {videoEnded && (
            <div className="fade-in absolute inset-0 z-10 flex animate-in flex-col items-center justify-center bg-black/80 backdrop-blur-xs duration-300">
              <div className="flex flex-col items-center gap-6 p-8 text-center">
                <div className="space-y-2">
                  <h3 className="font-bold text-2xl text-white">
                    Lesson Completed!
                  </h3>
                  <p className="text-white/70">
                    What would you like to do next?
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button
                    className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    disabled={isFirstLecture}
                    onClick={() => navigateToLecture("previous")}
                    variant="outline"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>

                  <Button
                    className="min-w-[120px]"
                    onClick={replayVideo}
                    variant="secondary"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Replay
                  </Button>

                  {!isCompleted && (
                    <Button
                      className="min-w-[140px] bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={loading}
                      onClick={handleLectureCompletion}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      Mark Complete
                    </Button>
                  )}

                  <Button
                    className="bg-white font-semibold text-black hover:bg-white/90"
                    disabled={isLastLecture}
                    onClick={() => navigateToLecture("next")}
                  >
                    Next Lesson <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Description Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About this lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {videoData.description ||
              "No description available for this lesson."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
