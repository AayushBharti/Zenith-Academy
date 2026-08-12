"use client";

import type { CourseResponse as CourseDetails } from "@workspace/shared-types";
import { Button } from "@workspace/ui/components/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@workspace/ui/components/carousel";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CourseCard } from "./course-card";

interface CourseSliderProps {
  courses: CourseDetails[];
}

export function CourseSlider({ courses }: CourseSliderProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  if (!courses?.length) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div className="flex flex-col space-y-3" key={i}>
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="space-y-2 p-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="group/slider relative">
      {/* Edge fade overlays */}
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent transition-opacity duration-300",
          canScrollPrev ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent transition-opacity duration-300",
          canScrollNext ? "opacity-100" : "opacity-0"
        )}
      />

      <Carousel
        className="w-full"
        opts={{ align: "start", loop: false, dragFree: true }}
        setApi={setApi}
      >
        <CarouselContent className="-ml-4">
          {courses.map((course) => (
            <CarouselItem
              className="basis-[80%] pl-4 sm:basis-[45%] lg:basis-[32%]"
              key={course._id}
            >
              <CourseCard course={course} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation buttons — appear on hover */}
      {canScrollPrev && (
        <Button
          className="-translate-y-1/2 absolute top-1/2 left-2 z-20 h-10 w-10 rounded-full bg-background/80 opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 hover:bg-background group-hover/slider:opacity-100"
          onClick={() => api?.scrollPrev()}
          size="icon"
          variant="outline"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      {canScrollNext && (
        <Button
          className="-translate-y-1/2 absolute top-1/2 right-2 z-20 h-10 w-10 rounded-full bg-background/80 opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 hover:bg-background group-hover/slider:opacity-100"
          onClick={() => api?.scrollNext()}
          size="icon"
          variant="outline"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
