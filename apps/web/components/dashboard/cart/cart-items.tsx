"use client"

import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/store/use-cart-store"
import { Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RatingStars } from "@/components/ui/rating-stars"

export default function CartItems() {
  const { cart, removeFromCart } = useCartStore()

  return (
    <div className="space-y-4">
      {cart.map((course: any) => (
        <Card key={course._id}>
          <CardContent className="flex items-start gap-4 p-4">
            <Image
              src={course.thumbnail}
              alt={course.courseName}
              width={160}
              height={90}
              className="rounded-md object-cover"
            />
            <div className="flex-1 space-y-2">
              <Link href={`/courses/${course._id}`}>
                <h3 className="text-lg font-semibold hover:underline">
                  {course.courseName}
                </h3>
              </Link>
              <Badge variant="secondary">{course.category.name}</Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {/* TODO: use React Stars
                <span>⭐ {course.averageRating.toFixed(1)}</span>
                <span>({course.ratingAndReviews.length} ratings)</span> */}
                {/* <RatingStars rating={course.averageRating} /> */}
                <span>{course.ratingAndReviews.length} ratings</span>
              </div>
            </div>
            <div className="text-right">
              <p className="mb-2 text-2xl font-bold">₹{course.price}</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeFromCart(course._id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
