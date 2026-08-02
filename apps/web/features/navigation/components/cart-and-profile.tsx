"use client";

import { Button } from "@workspace/ui/components/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ACCOUNT_TYPE } from "@/data/constants";
import ProfileDropdown from "@/features/auth/components/profile-drop-down";
import { useCartStore } from "@/features/cart/use-cart-store";
import { useProfileStore } from "@/features/profile/use-profile-store";

/** Auth-aware cart + profile controls for the navbar. Handles hydration internally. */
export default function CartAndProfile() {
  const { user } = useProfileStore();
  const { totalItems } = useCartStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Prevent hydration mismatch — render nothing until client-side stores are ready
  if (!hydrated) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          animation="slide-in"
          asChild
          className="hidden font-medium text-sm sm:inline-flex"
          variant="ghost"
        >
          <Link href="/login">Log in</Link>
        </Button>
        <Button
          asChild
          className="hidden shadow-md transition-all hover:shadow-lg sm:inline-flex"
          size="sm"
        >
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    );
  }

  const isStudent = user.accountType === ACCOUNT_TYPE.STUDENT;

  return (
    <div className="flex items-center gap-2">
      {isStudent && (
        <Button asChild className="relative" size="icon" variant="ghost">
          <Link href="/dashboard/cart">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="-top-1 -right-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-destructive font-bold text-[10px] text-white ring-2 ring-background">
                {totalItems}
              </span>
            )}
          </Link>
        </Button>
      )}
      <ProfileDropdown />
    </div>
  );
}
