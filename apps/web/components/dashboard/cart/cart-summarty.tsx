"use client"

import { useRouter } from "next/navigation"
import { buyCourse } from "@/services/payment-service"
import { useAuthStore } from "@/store/use-auth-store"
import { useCartStore } from "@/store/use-cart-store"
import { useProfileStore } from "@/store/use-profile-store"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function CartSummary() {
  const { total, cart } = useCartStore()
  const { token } = useAuthStore()
  const { user } = useProfileStore()
  const router = useRouter()

  const handleBuyCourse = () => {
    const courses = cart.map((course: any) => course._id)
    if (token) {
      console.log(courses)
      console.log(user?.firstName)
      buyCourse(token, courses, user, router.push)
    } else {
      router.push("/login")
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span>₹0</span>
          </div>
          <div className="border-t border-border pt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg" onClick={handleBuyCourse}>
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  )
}
