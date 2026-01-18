"use client";

import { Star, Trash2, User2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";

export default function CartItems() {
  const { cart, removeFromCart } = useCartStore();

  return (
    <div className="flex flex-col gap-6">
      <AnimatePresence mode="popLayout">
        {cart.map((course: any) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="group flex flex-col gap-5 rounded-xl border border-border bg-card p-4 shadow-xs transition-all duration-300 hover:border-primary/20 sm:flex-row"
            exit={{ opacity: 0, x: -100 }}
            initial={{ opacity: 0, y: 10 }}
            key={course._id}
            layout
            transition={{ duration: 0.3 }}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:w-[180px]">
              <Image
                alt={course.courseName}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                fill
                src={course.thumbnail}
              />
            </div>

            {/* Content Info */}
            <div className="flex flex-1 flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-4">
                  <Link className="flex-1" href={`/courses/${course._id}`}>
                    <h3 className="line-clamp-2 font-bold text-lg leading-tight transition-colors group-hover:text-primary">
                      {course.courseName}
                    </h3>
                  </Link>
                  {/* Mobile Price (Hidden on Desktop to keep layout clean) */}
                  <div className="font-bold text-lg sm:hidden">
                    ₹{course.price.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Category Badge */}
                <Badge
                  className="bg-secondary/50 font-normal text-muted-foreground text-xs"
                  variant="secondary"
                >
                  {course.category?.name}
                </Badge>

                {/* Instructor */}
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <User2 className="h-3.5 w-3.5" />
                  <span>
                    By {course.instructor?.firstName}{" "}
                    {course.instructor?.lastName}
                  </span>
                </div>
              </div>

              {/* Ratings */}
              <div className="flex items-center gap-2 pt-1 text-sm">
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  {course.averageRating || 4.5}{" "}
                  <Star className="h-3 w-3 fill-current" />
                </span>
                <span className="text-muted-foreground text-xs">
                  ({course.ratingAndReviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price & Actions (Desktop) */}
            <div className="flex flex-row items-end justify-between gap-4 sm:flex-col sm:border-border/50 sm:border-l sm:pl-4">
              <div className="hidden space-y-1 text-right sm:block">
                <p className="font-bold text-foreground text-xl">
                  ₹{course.price.toLocaleString("en-IN")}
                </p>
                {/* Fake original price for UX effect */}
                <p className="text-muted-foreground text-xs line-through">
                  ₹{(course.price * 1.2).toFixed(0)}
                </p>
              </div>

              <Button
                className="-mr-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={() => removeFromCart(course._id)}
                size="sm"
                variant="ghost"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
