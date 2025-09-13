"use client"

import React from "react"
import { Quote, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

import { GeneralSwiper } from "./general-swiper"

interface Review {
  id: number
  name: string
  image: string
  rating: number
  review: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Alice Johnson",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&h=150",
    rating: 5,
    review:
      "Absolutely love this product! It has made my life so much easier. The attention to detail is impressive.",
  },
  {
    id: 2,
    name: "Bob Smith",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=150&h=150",
    rating: 4,
    review:
      "Great value for money. Would definitely recommend to others. The customer support is also top-notch.",
  },
  {
    id: 3,
    name: "Carol Williams",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=150&h=150",
    rating: 5,
    review:
      "Top-notch quality and excellent customer service. I've been using it for months and it still works like new.",
  },
  {
    id: 4,
    name: "David Brown",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150",
    rating: 4,
    review:
      "Very satisfied with my purchase. Will buy again! The product exceeded my expectations in many ways.",
  },
  {
    id: 5,
    name: "Eva Davis",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?fit=crop&w=150&h=150",
    rating: 5,
    review:
      "Exceeded my expectations. Truly a game-changer! I can't imagine going back to my old routine without it.",
  },
]

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <Card className="h-full bg-card">
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={review.image} alt={review.name} />
          <AvatarFallback>
            {review.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-foreground">{review.name}</h3>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4 text-yellow-500",
                  i < review.rating && "fill-yellow-500"
                )}
              />
            ))}
          </div>
        </div>
      </div>
      <Quote className="w-8 h-8 text-primary/20 mb-2" />
      <p className="text-muted-foreground">{review.review}</p>
    </CardContent>
  </Card>
)

export default function ReviewsCarousel() {
  return (
    <div className="w-full container mx-auto px-5 py-8">
      <GeneralSwiper
        slidesPerView={{ 640: 2, 1024: 4 }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        navigation={true}
        pagination={true}
        className="py-12"
      >
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </GeneralSwiper>
    </div>
  )
}
