"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { createRating } from "@/services/course-details-service"
import { useAuthStore } from "@/store/use-auth-store"
import { useProfileStore } from "@/store/use-profile-store"
import { Star } from "lucide-react"
import { useForm } from "react-hook-form"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FormData {
  userRating: number
  userExperience: string
}

export function ReviewModal({
  setReviewModal,
}: {
  setReviewModal: (isOpen: boolean) => void
}) {
  const { courseId } = useParams()

  const { token } = useAuthStore()
  const { user } = useProfileStore()
  const [rating, setRating] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      await createRating(
        {
          courseId: courseId as string,
          review: data.userExperience,
          rating: data.userRating,
        },
        token as string
      )
      setReviewModal(false)
      reset()
      setRating(0)
    } catch (error) {
      console.error("Error submitting review:", error)
    }
  }

  return (
    <Dialog open={true} onOpenChange={setReviewModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Review</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar>
            <AvatarImage src={user?.image} alt={user?.firstName} />
            <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-muted-foreground">Posting Publicly</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="rating">Rating</Label>
            <div className="flex space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    star <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => {
                    setRating(star)
                  }}
                />
              ))}
            </div>
            <Input
              type="hidden"
              id="rating"
              value={rating}
              {...register("userRating", {
                required: "Please provide a rating",
              })}
            />
            {errors.userRating && (
              <p className="text-sm text-red-500 mt-1">
                {errors.userRating.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="experience">Your Experience</Label>
            <Textarea
              id="experience"
              placeholder="Write your experience..."
              {...register("userExperience", {
                required: "Please share your experience",
              })}
              className="mt-1"
            />
            {errors.userExperience && (
              <p className="text-sm text-red-500 mt-1">
                {errors.userExperience.message}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setReviewModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Review</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
