"use client";

import { ArrowRight, PackageOpen, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import StudentRoute from "@/components/auth/student-route";
import CartItems from "@/components/dashboard/cart/cart-items";
import CartSummary from "@/components/dashboard/cart/cart-summarty";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/use-cart-store";

export default function Cart() {
  const { total, totalItems } = useCartStore();

  return (
    <StudentRoute>
      <div className="mx-auto min-h-[calc(100vh-100px)] w-full max-w-7xl space-y-8 p-4 md:p-8">
        {/* --- Header Section --- */}
        <div className="space-y-2">
          <h1 className="flex items-center gap-3 font-bold text-3xl tracking-tight md:text-4xl">
            <ShoppingCart className="h-8 w-8 text-primary" />
            Shopping Cart
          </h1>
          <p className="text-lg text-muted-foreground">
            {totalItems} {totalItems === 1 ? "Course" : "Courses"} in your cart
          </p>
        </div>

        <Separator />

        {/* --- Content Section --- */}
        {total > 0 ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-8 lg:grid-cols-3 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Left Column: Cart Items */}
            <div className="space-y-6 lg:col-span-2">
              <CartItems />
            </div>

            {/* Right Column: Summary (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSummary />
              </div>
            </div>
          </motion.div>
        ) : (
          <EmptyCartState />
        )}
      </div>
    </StudentRoute>
  );
}

// --- Sub-Component: Empty State ---
function EmptyCartState() {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center space-y-6 rounded-2xl border-2 border-muted border-dashed bg-secondary/10 py-16 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
    >
      <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
        <PackageOpen className="h-12 w-12 text-muted-foreground" />
      </div>

      <div className="mx-auto max-w-md space-y-2 px-4">
        <h2 className="font-bold text-2xl tracking-tight">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground">
          Looks like you haven't added any courses yet. Explore our catalog to
          find your next learning adventure.
        </p>
      </div>

      <Button asChild className="mt-4" size="lg">
        <Link className="flex items-center gap-2" href="/catalog">
          Browse Courses <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </motion.div>
  );
}
