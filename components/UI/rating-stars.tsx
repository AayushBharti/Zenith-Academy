import { Star, StarHalf } from "lucide-react"

interface RatingStarsProps {
  rating: number
  maxRating?: number
}

export function RatingStars({ rating, maxRating = 5 }: RatingStarsProps) {
  // Ensure the rating is a valid number and clamp it between 0 and maxRating
  const validRating = Math.max(0, Math.min(Number(rating), maxRating))

  // Calculate the number of full stars
  const fullStars = Math.floor(validRating)

  // Check if there's a half star (if the rating has a decimal part)
  const hasHalfStar = validRating % 1 !== 0

  // Calculate the number of empty stars (maxRating - the number of full and half stars)
  const emptyStars = Math.max(0, maxRating - Math.ceil(validRating))

  // Avoid creating arrays with invalid lengths
  if (fullStars < 0 || isNaN(fullStars)) return null

  // Only render if the number of full stars is valid
  return (
    <div className="flex">
      {/* Render full stars */}
      {[...Array(fullStars).keys()].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      ))}

      {/* Render a half star if necessary */}
      {hasHalfStar && (
        <StarHalf className="w-4 h-4 text-yellow-400 fill-current" />
      )}

      {/* Render empty stars */}
      {[...Array(emptyStars).keys()].map((_, i) => (
        <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  )
}
