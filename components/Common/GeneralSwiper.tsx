"use client"

import React, { ReactNode, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Swiper as SwiperType } from "swiper"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { Button } from "@/components/ui/button"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

interface GeneralSwiperProps {
  children: ReactNode
  slidesPerView?: number | { [key: number]: number }
  spaceBetween?: number
  autoplay?: boolean | { delay: number; disableOnInteraction: boolean }
  loop?: boolean
  navigation?: boolean
  pagination?: boolean
  className?: string
}

export function GeneralSwiper({
  children,
  slidesPerView = 1,
  spaceBetween = 20,
  autoplay = false,
  loop = true,
  navigation = true,
  pagination = true,
  className = "",
}: GeneralSwiperProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)

  const breakpoints =
    typeof slidesPerView === "object"
      ? Object.entries(slidesPerView).reduce(
          (acc, [key, value]) => {
            acc[parseInt(key)] = { slidesPerView: value }
            return acc
          },
          {} as { [key: number]: { slidesPerView: number } }
        )
      : {
          640: {
            slidesPerView: Math.min(2, slidesPerView as number),
          },
          1024: {
            slidesPerView: slidesPerView,
          },
        }

  return (
    <div className={`w-full relative ${className}`}>
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={spaceBetween}
        slidesPerView={1}
        autoplay={
          autoplay
            ? {
                delay: 5000,
                disableOnInteraction: false,
                ...(typeof autoplay === "object" ? autoplay : {}),
              }
            : false
        }
        loop={loop}
        navigation={
          navigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }
            : false
        }
        pagination={
          pagination
            ? {
                clickable: true,
                el: ".swiper-pagination",
                bulletActiveClass: "bg-primary",
              }
            : false
        }
        breakpoints={breakpoints}
        onSwiper={setSwiper}
        className="py-12"
      >
        {React.Children.map(children, (child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}
      </Swiper>
      {pagination && <div className="swiper-pagination mt-4"></div>}
      {navigation && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-background/60 text-foreground hover:bg-accent hover:text-accent-foreground rounded-full"
            onClick={() => swiper?.slidePrev()}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-background/60 text-foreground hover:bg-accent hover:text-accent-foreground rounded-full"
            onClick={() => swiper?.slideNext()}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next slide</span>
          </Button>
        </>
      )}
    </div>
  )
}
