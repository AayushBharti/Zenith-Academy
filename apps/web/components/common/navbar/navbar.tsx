"use client";

import { Cpu, Globe, Layout, Menu, ShoppingCart, Sparkles } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import ProfileDropdown from "@/components/auth/profile-drop-down";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import { useProfileStore } from "@/store/use-profile-store";
import { ACCOUNT_TYPE } from "../../../data/constants";
import { ModeToggle } from "../mode-toggle";
import DesktopMenu from "./desktop-menu";
import MobileMenu from "./mobile-menu";

// --- Centralized Navigation Data ---
export const NAV_DATA = [
  {
    id: "catalog",
    label: "Catalog",
    type: "menu",
    description: "Explore our wide range of courses",
    featuredImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500&auto=format&fit=crop",
    items: [
      {
        title: "Web Development",
        href: "/catalog/web-development",
        description: "Master React, Next.js, and Node.js.",
        icon: Layout,
      },
      {
        title: "Web 3 & Blockchain",
        href: "/catalog/web3-blockchain",
        description: "Build dApps with Solidity and Ethereum.",
        icon: Globe,
      },
      {
        title: "Artificial Intelligence",
        href: "/catalog/ai",
        description: "Learn Python, ML, and Neural Networks.",
        icon: Cpu,
      },
    ],
  },
  // {
  //   id: "resources",
  //   label: "Resources",
  //   type: "menu",
  //   items: [
  //     {
  //       title: "Blog",
  //       href: "/",
  //       description: "Latest tech articles.",
  //       icon: FileText,
  //     },
  //     {
  //       title: "Community",
  //       href: "/",
  //       description: "Join our Discord.",
  //       icon: Users,
  //     },
  //     {
  //       title: "Career Paths",
  //       href: "/",
  //       description: "Guided roadmaps.",
  //       icon: MapPin,
  //     },
  //     {
  //       title: "Documentation",
  //       href: "/",
  //       description: "Platform guides.",
  //       icon: Book,
  //     },
  //   ],
  // },
  {
    id: "about",
    label: "About",
    href: "/about",
    type: "link",
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    type: "link",
  },
];

export default function Navbar() {
  const { token } = useAuthStore();
  const { totalItems } = useCartStore();
  const { user } = useProfileStore();
  const [isClient, setIsClient] = useState(false);

  // Scroll Logic
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isTop, setIsTop] = useState(true);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (current) => {
    setIsTop(current < 50);
    const diff = current - (scrollY.getPrevious() ?? 0);
    setVisible(current < 20 || diff < 0);
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isHomepage = pathname === "/";
  const isTransparent = isHomepage && isTop;

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300",
        !visible && isHomepage && "-translate-y-full",
        !isTransparent
          ? "border-border/40 border-b bg-background/80 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-16 items-center justify-between px-5 transition-all",
          isHomepage && "container"
        )}
      >
        <div className="flex items-center gap-8">
          {/* Logo */}

          <Link className="group flex items-center gap-2" href="/">
            <div className="flex aspect-square size-8.5 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4.5" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Zenith Academy</span>
              <span className="truncate text-muted-foreground text-xs">
                Learning Platform
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <DesktopMenu navData={NAV_DATA} />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <ModeToggle />
          </div>

          {isClient && (
            <CartAndProfile
              isStudent={user?.accountType === ACCOUNT_TYPE.STUDENT}
              token={token}
              totalItems={totalItems}
            />
          )}

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden" size="icon" variant="ghost">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[320px] p-0" side="right">
              <MobileMenu navData={NAV_DATA} token={token} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}

function CartAndProfile({
  token,
  totalItems,
  isStudent,
}: {
  token: string | null;
  totalItems: number;
  isStudent: boolean;
}) {
  if (!token) {
    return (
      <div className="flex items-center gap-2">
        <Button
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
