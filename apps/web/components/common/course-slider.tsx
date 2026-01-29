import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import type { CourseDetails } from "@/types/course";
import { CourseCard } from "./course-card";

interface CourseSliderProps {
  courses: CourseDetails[];
}

export function CourseSlider({ courses }: CourseSliderProps) {
  // Loading State / Empty State
  if (!courses?.length) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((_, index) => (
          <div className="flex flex-col space-y-3" key={index}>
            <Skeleton className="h-[220px] w-full rounded-xl" />
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
    <div className="w-full">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: false,
        }}
      >
        <CarouselContent className="-ml-4 pb-4">
          {courses.map((course) => (
            <CarouselItem
              className="basis-[85%] pl-4 md:basis-[45%] lg:basis-[32%]"
              // Responsive basis values to mimic "slidesPerView" with peeking
              // basis-[85%] = shows 1 full card + 15% of next (Mobile)
              // md:basis-[45%] = shows 2 full cards + 10% of next (Tablet)
              // lg:basis-[32%] = shows 3 full cards + space (Desktop)
              key={course._id}
            >
              <div className="h-full p-1">
                <CourseCard course={course} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons (Hidden on mobile for cleaner look, visible on larger screens) */}
        <div className="hidden md:block">
          <CarouselPrevious className="-left-4 lg:-left-12 h-10 w-10 border-border" />
          <CarouselNext className="-right-4 lg:-right-12 h-10 w-10 border-border" />
        </div>
      </Carousel>
    </div>
  );
}
