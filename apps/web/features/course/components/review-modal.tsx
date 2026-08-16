"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateRating } from "@/features/course/hooks/use-course-mutations";
import { useProfileStore } from "@/features/profile/use-profile-store";

interface FormData {
  userRating: number;
  userExperience: string;
}

const ratingLabels: Record<number, string> = {
  5: "Excellent!",
  4: "Good",
  3: "Average",
  2: "Below Average",
  1: "Poor",
};

export function ReviewModal({
  setReviewModal,
}: {
  setReviewModal: (isOpen: boolean) => void;
}) {
  const { courseId } = useParams();
  const { user } = useProfileStore();
  const createRatingMutation = useCreateRating();

  const [hover, setHover] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      userRating: 0,
      userExperience: "",
    },
  });

  // Watch rating for conditional styling (optional, but good for debugging)
  const rating = watch("userRating");

  // Register the rating field manually since it doesn't use a native input
  useEffect(() => {
    register("userRating", {
      required: "Please select a star rating",
      min: { value: 1, message: "Rating must be at least 1 star" },
    });
  }, [register]);

  const onSubmit = (data: FormData) => {
    createRatingMutation.mutate(
      {
        courseId: courseId as string,
        review: data.userExperience,
        rating: data.userRating,
      },
      {
        onSuccess: () => {
          setReviewModal(false);
        },
      }
    );
  };

  const handleStarClick = (starValue: number) => {
    setValue("userRating", starValue, { shouldValidate: true });
  };

  return (
    <Dialog onOpenChange={setReviewModal} open={true}>
      <DialogContent className="gap-6 sm:max-w-[500px]">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-2xl">How was the course?</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve and helps other students make better
            choices.
          </DialogDescription>
        </DialogHeader>

        {/* User Profile Section */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage alt={user?.firstName} src={user?.image} />
            <AvatarFallback className="text-lg">
              {user?.firstName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-semibold text-lg leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="mt-1 text-muted-foreground text-xs">
              Posting Publicly
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Star Rating Section */}
          <div className="flex flex-col items-center gap-2">
            <Label
              className={cn(
                "text-base",
                errors.userRating && "text-destructive"
              )}
            >
              {rating > 0
                ? (ratingLabels[rating] ?? "Select a Rating")
                : "Select a Rating"}
            </Label>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  className="transition-transform hover:scale-110 focus:outline-hidden"
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  type="button"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors duration-200",
                      // Logic: If hovering, show gold up to hover index.
                      // If not hovering, show gold up to selected rating.
                      (hover || rating) >= star
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
            {errors.userRating && (
              <span className="animate-pulse font-medium text-destructive text-sm">
                {errors.userRating.message}
              </span>
            )}
          </div>

          {/* Text Area Section */}
          <div className="space-y-2">
            <Label htmlFor="experience">Your Experience</Label>
            <Textarea
              id="experience"
              placeholder="Tell us about your learning journey..."
              {...register("userExperience", {
                required: "Please write a few words about your experience",
                minLength: {
                  value: 10,
                  message: "Review must be at least 10 characters long",
                },
              })}
              className="min-h-[120px] resize-none bg-secondary/20"
            />
            {errors.userExperience && (
              <p className="font-medium text-destructive text-sm">
                {errors.userExperience.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              disabled={createRatingMutation.isPending}
              onClick={() => setReviewModal(false)}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button className="min-w-[120px]" disabled={createRatingMutation.isPending} type="submit">
              {createRatingMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
