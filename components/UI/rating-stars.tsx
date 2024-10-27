import { Star, StarHalf } from "lucide-react"

interface RatingStarsProps {
  rating: number
  maxRating?: number
}

export function RatingStars({ rating, maxRating = 5 }: RatingStarsProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-4 h-4 text-yellow-400 fill-current" />
      )}
      {[...Array(Math.max(maxRating - Math.ceil(rating), 0))].map((_, i) => (
        <Star
          key={i + fullStars + (hasHalfStar ? 1 : 0)}
          className="w-4 h-4 text-gray-300"
        />
      ))}
    </div>
  )
}
