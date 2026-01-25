"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buyCourse } from "@/services/payment-service";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import { useProfileStore } from "@/store/use-profile-store";

export default function CartSummary() {
  const { total, cart } = useCartStore();
  const { token } = useAuthStore();
  const { user } = useProfileStore();
  const router = useRouter();

  const handleBuyCourse = () => {
    const courses = cart.map((course: any) => course._id);
    if (token) {
      buyCourse(token, courses, user, router.push);
    } else {
      router.push("/login");
    }
  };

  return (
    <Card className="overflow-hidden border-muted/60 shadow-lg">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="font-medium text-lg text-muted-foreground">
          Summary
        </CardTitle>
        <div className="pt-2">
          <span className="font-bold text-3xl text-foreground">
            ₹{total.toLocaleString("en-IN")}
          </span>
          <span className="ml-2 text-muted-foreground text-sm line-through">
            ₹{(total * 1.2).toLocaleString("en-IN")}
          </span>
          <span className="mt-1 block font-medium text-emerald-600 text-xs">
            20% off using coupon code
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Promo Code UI (Visual Only) */}
        {/* <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Coupon Code" className="pl-9 bg-background" />
            </div>
            <Button variant="outline">Apply</Button>
          </div>
        </div>

        <Separator /> */}

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span className="font-medium text-emerald-600">- ₹0</span>
          </div>
          <div className="mt-2 flex justify-between border-t pt-3">
            <span className="font-bold text-base">Total</span>
            <span className="font-bold text-base">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 p-6 pt-0">
        <Button
          className="h-11 w-full font-semibold text-base shadow-md"
          onClick={handleBuyCourse}
          size="lg"
        >
          Checkout Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <div className="flex w-full items-center justify-center gap-2 rounded-md bg-muted/30 p-2 text-muted-foreground text-xs">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Secure 256-bit SSL encrypted payment</span>
        </div>
      </CardFooter>
    </Card>
  );
}
