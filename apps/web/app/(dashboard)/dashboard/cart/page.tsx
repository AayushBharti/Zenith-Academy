"use client";

import { Button } from "@workspace/ui/components/button";
import { PackageOpen, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import StudentRoute from "@/features/auth/components/student-route";
import CartItems from "@/features/cart/components/cart-items";
import CartSummary from "@/features/cart/components/cart-summarty";
import { useCartStore } from "@/features/cart/use-cart-store";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";
import { EmptyState } from "@/features/dashboard/components/empty-state";

export default function Cart() {
  const { total, totalItems } = useCartStore();

  return (
    <StudentRoute>
      <div className="container space-y-8 p-4 md:p-8">
        <DashboardPageHeader
          description={`${totalItems} ${
            totalItems === 1 ? "Course" : "Courses"
          } in your cart`}
          title="Shopping Cart"
        >
          <ShoppingCart className="h-8 w-8 text-primary" />
        </DashboardPageHeader>

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
          <EmptyState
            action={
              <Button animation="swap" asChild size="lg">
                <Link href="/catalog">Browse Courses</Link>
              </Button>
            }
            description="Looks like you haven't added any courses yet. Explore our catalog to find your next learning adventure."
            icon={PackageOpen}
            title="Your cart is empty"
          />
        )}
      </div>
    </StudentRoute>
  );
}
