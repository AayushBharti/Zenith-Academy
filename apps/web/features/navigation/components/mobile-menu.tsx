"use client";

import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  ArrowLeft,
  ChevronRight,
  LogIn,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { useProfileStore } from "@/features/profile/use-profile-store";
import { ModeToggle } from "@/features/shared/components/mode-toggle";

interface NavSubItem {
  title: string;
  href: string;
  description: string;
  icon?: React.ElementType;
}

interface NavItem {
  id: string;
  label: string;
  type: "menu" | "link";
  href?: string;
  description?: string;
  featuredImage?: string;
  items?: NavSubItem[];
}

interface MobileMenuProps {
  navData: NavItem[];
}

export default function MobileMenu({ navData }: MobileMenuProps) {
  const { user } = useProfileStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  // 'main' means top level. Any other string is the ID of the active submenu.
  const [activeMenu, setActiveMenu] = useState<string>("main");

  // Find the currently active submenu data
  const subMenuData = navData.find((item) => item.id === activeMenu);

  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 border-b p-4">
        {activeMenu !== "main" ? (
          <Button
            className="h-8 w-8"
            onClick={() => setActiveMenu("main")}
            size="icon"
            variant="ghost"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
        )}
        <span className="font-bold text-lg">
          {activeMenu === "main" ? "Menu" : subMenuData?.label}
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="relative p-4">
          <AnimatePresence
            custom={activeMenu === "main" ? -1 : 1}
            mode="popLayout"
          >
            {activeMenu === "main" ? (
              // --- MAIN MENU VIEW ---
              <motion.div
                animate="animate"
                className="flex flex-col gap-2"
                custom={-1}
                exit="exit"
                initial="initial"
                key="main"
                variants={variants}
              >
                {navData.map((item) => (
                  <div key={item.id}>
                    {item.type === "menu" ? (
                      <button
                        className="flex w-full items-center justify-between rounded-md p-3 text-left font-medium text-base hover:bg-muted"
                        onClick={() => setActiveMenu(item.id)}
                      >
                        {item.label}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ) : (
                      <Link
                        className="flex w-full items-center rounded-md p-3 font-medium text-base hover:bg-muted"
                        href={item.href ?? "/"}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </motion.div>
            ) : (
              // --- SUBMENU VIEW ---
              <motion.div
                animate="animate"
                className="flex flex-col gap-2"
                custom={1}
                exit="exit"
                initial="initial"
                key="submenu"
                variants={variants}
              >
                {subMenuData?.items?.map((subItem: NavSubItem) => (
                  <Link
                    className="group flex items-start gap-3 rounded-md p-3 hover:bg-muted"
                    href={subItem.href}
                    key={subItem.title}
                  >
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background group-hover:border-primary/50">
                      {subItem.icon && <subItem.icon className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-sm">
                        {subItem.title}
                      </span>
                      <span className="line-clamp-1 text-muted-foreground text-xs">
                        {subItem.description}
                      </span>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        {hydrated && !user && (
          <div className="mb-4 grid grid-cols-2 gap-3">
            <Button animation="swap" asChild variant="outline">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Log in
              </Link>
            </Button>
            <Button animation="slide-in" asChild>
              <Link href="/signup">
                <UserPlus className="mr-2 h-4 w-4" /> Sign up
              </Link>
            </Button>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="font-medium text-muted-foreground text-sm">
            Theme
          </span>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
