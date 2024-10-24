"use client"

import { useCartStore } from "@/store/useCartStore"

import CartItems from "@/components/Dashboard/Cart/CartItems"
import CartSummary from "@/components/Dashboard/Cart/CartSummarty"

export default function Cart() {
  const { total, totalItems } = useCartStore()

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-10 text-3xl font-bold text-primary">Shopping Cart</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        {totalItems} {totalItems === 1 ? "Course" : "Courses"} in Cart
      </p>

      {total > 0 ? (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CartItems />
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
          Your cart is empty
        </div>
      )}
    </div>
  )
}
