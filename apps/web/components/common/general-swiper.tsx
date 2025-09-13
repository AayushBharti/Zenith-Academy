"use client"

import React, { ReactNode, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Swiper as SwiperType } from "swiper"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

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
      {/* {navigation && (
        <>
          <div
            className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-background/60 text-foreground hover:bg-accent hover:text-accent-foreground rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
            onClick={() => swiper?.slidePrev()}
            role="button"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </div>
          <div
            className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-background/60 text-foreground hover:bg-accent hover:text-accent-foreground rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
            onClick={() => swiper?.slideNext()}
            role="button"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </div>
        </>
      )} */}
    </div>
  )
}
