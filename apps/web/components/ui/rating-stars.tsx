import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 16,
  className,
}: RatingStarsProps) {
  return (
    <div
      aria-label={`Rating: ${rating} out of ${maxRating} stars`}
      className={cn("flex items-center gap-0.5", className)}
    >
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;

        if (rating >= starValue) {
          // Full Star
          return (
            <Star
              className="fill-amber-400 text-amber-400"
              key={index}
              size={size}
            />
          );
        }
        if (rating >= starValue - 0.5) {
          // Half Star
          return (
            <div className="relative" key={index}>
              {/* Background empty star for the half-star to sit on top of */}
              <Star
                className="absolute top-0 left-0 text-muted-foreground/20"
                size={size}
              />
              <StarHalf
                className="relative z-10 fill-amber-400 text-amber-400"
                size={size}
              />
            </div>
          );
        }
        // Empty Star
        return (
          <Star className="text-muted-foreground/20" key={index} size={size} />
        );
      })}
    </div>
  );
}
