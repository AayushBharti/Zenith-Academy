"use client";

import type {
  SectionResponse as Section,
  SubSectionResponse as SubSection,
} from "@workspace/shared-types";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMarkLectureComplete } from "@/features/course/hooks/use-course-mutations";
import useViewCourseStore from "@/features/course/use-view-course-store";
import { useProfileStore } from "@/features/profile/use-profile-store";
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from "./video-player";

export function VideoDetails() {
  const { courseId, subsectionId } = useParams();
  const router = useRouter();
  const { user } = useProfileStore();
  const { courseSectionData, completedLectures, setCompletedLectures } =
    useViewCourseStore();

  const [videoData, setVideoData] = useState<SubSection | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const markCompleteMutation = useMarkLectureComplete();

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
      (courseSectionData[currentIndices.sIndex]?.subSection?.length ?? 0) - 1;

  const navigateToLecture = (direction: "next" | "previous") => {
    let { sIndex, subIndex } = currentIndices;

    if (direction === "next" && !isLastLecture) {
      subIndex++;
      if (subIndex === (courseSectionData[sIndex]?.subSection?.length ?? 0)) {
        sIndex++;
        subIndex = 0;
      }
    } else if (direction === "previous" && !isFirstLecture) {
      subIndex--;
      if (subIndex < 0) {
        sIndex--;
        subIndex = (courseSectionData[sIndex]?.subSection?.length ?? 0) - 1;
      }
    }

    const nextSection = courseSectionData[sIndex];
    const nextSubsection = nextSection?.subSection?.[subIndex];
    if (!(nextSection && nextSubsection)) return;
    router.push(
      `/dashboard/enrolled-courses/${courseId}/section/${nextSection._id}/sub-section/${nextSubsection._id}`
    );
  };

  const handleLectureCompletion = () => {
    if (!(user?._id && videoData)) return;

    markCompleteMutation.mutate(
      {
        userId: user._id,
        courseId: courseId as string,
        subSectionId: subsectionId as string,
      },
      {
        onSuccess: () => {
          setCompletedLectures([...completedLectures, videoData._id]);
        },
      }
    );
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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-bold text-xl tracking-tight md:text-2xl">
            {videoData.title}
          </h1>
          {isCompleted && (
            <Badge
              className="shrink-0 bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
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

      {/* Video Player */}
      <Card className="overflow-hidden py-0 shadow-lg">
        <VideoPlayer className="h-full w-full rounded-lg border-0">
          <VideoPlayerContent
            crossOrigin=""
            disablePictureInPicture
            muted={false}
            onEnded={() => setVideoEnded(true)}
            preload="auto"
            ref={videoRef}
            slot="media"
            src={videoData.videoUrl}
          />
          <VideoPlayerControlBar>
            <VideoPlayerPlayButton />
            <VideoPlayerSeekBackwardButton />
            <VideoPlayerSeekForwardButton />
            <VideoPlayerTimeRange />
            <VideoPlayerTimeDisplay showDuration />
            <VideoPlayerMuteButton />
            <VideoPlayerVolumeRange />
          </VideoPlayerControlBar>
        </VideoPlayer>

        {/* Video Ended Overlay */}
        {videoEnded && (
          <div className="fade-in absolute inset-0 z-10 flex animate-in flex-col items-center justify-center bg-black/80 backdrop-blur-xs duration-300">
            <div className="flex flex-col items-center gap-6 p-8 text-center">
              <div className="space-y-2">
                <h3 className="font-bold text-2xl text-white">
                  Lesson Completed!
                </h3>
                <p className="text-white/70">What would you like to do next?</p>
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
                    disabled={markCompleteMutation.isPending}
                    onClick={handleLectureCompletion}
                  >
                    {markCompleteMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    Mark Complete
                  </Button>
                )}

                <Button
                  animation="slide-in"
                  className="bg-white font-semibold text-black hover:bg-white/90"
                  disabled={isLastLecture}
                  onClick={() => navigateToLecture("next")}
                >
                  Next Lesson
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation + Mark Complete */}
      <div className="flex items-center justify-between gap-4">
        <Button
          disabled={isFirstLecture}
          onClick={() => navigateToLecture("previous")}
          size="sm"
          variant="outline"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>

        <div className="flex items-center gap-3">
          {!isCompleted && (
            <Button
              disabled={markCompleteMutation.isPending}
              onClick={handleLectureCompletion}
              size="sm"
              variant="secondary"
            >
              {markCompleteMutation.isPending ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-1 h-4 w-4" />
              )}
              Mark Complete
            </Button>
          )}

          <Button
            disabled={isLastLecture}
            onClick={() => navigateToLecture("next")}
            size="sm"
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Description */}
      {videoData.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About this lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {videoData.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
