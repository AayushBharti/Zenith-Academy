"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";
import { Cpu, Globe, Layout, Menu } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { isChromeHidden } from "@/data/layout-config";
import { ModeToggle } from "../../shared/components/mode-toggle";
import CartAndProfile from "./cart-and-profile";
import DesktopMenu from "./desktop-menu";
import MobileMenu from "./mobile-menu";

// --- Centralized Navigation Data ---
export const NAV_DATA = [
  {
    id: "catalog",
    label: "Catalog",
    type: "menu" as const,
    description: "Explore our wide range of courses",
    featuredImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500&auto=format&fit=crop",
    items: [
      {
        title: "Web Development",
        href: "/catalog/web-development",
        description: "Build modern, responsive, and scalable web applications.",
        icon: Layout,
      },
      {
        title: "Blockchain & Web3",
        href: "/catalog/blockchain-web3",
        description: "Explore smart contracts, DeFi, and decentralized apps.",
        icon: Globe,
      },
      {
        title: "AI & Machine Learning",
        href: "/catalog/ai-machine-learning",
        description: "Dive into ML, deep learning, and data science.",
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
    type: "link" as const,
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    type: "link" as const,
  },
];

export default function Navbar() {
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

  if (isChromeHidden(pathname)) return null;

  const isTransparent = isTop;

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300",
        !visible && "-translate-y-full",
        !isTransparent
          ? "border-primary/15 border-b bg-accent/50 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between transition-all">
        <div className="flex items-center gap-8">
          {/* Logo */}

          <Link className="group flex items-center gap-2" href="/">
            <img alt="" aria-hidden="true" className="size-9" src="/icon.svg" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Nextdemy</span>
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

          <CartAndProfile />

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden" size="icon" variant="ghost">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-80 p-0" side="right">
              <MobileMenu navData={NAV_DATA} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
