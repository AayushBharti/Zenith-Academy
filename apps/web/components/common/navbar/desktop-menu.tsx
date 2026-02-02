"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function DesktopMenu({ navData }: { navData: any[] }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navData.map((item) => {
          if (item.type === "menu") {
            return (
              <NavigationMenuItem key={item.id}>
                <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {/* Featured Item (Only if image exists) */}
                    {item.featuredImage && (
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="group relative flex h-full w-full select-none flex-col justify-end overflow-hidden rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/catalog"
                          >
                            <Image
                              alt="Featured"
                              className="absolute inset-0 object-cover opacity-30 transition-transform duration-500 group-hover:scale-105"
                              fill
                              src={item.featuredImage}
                            />
                            <div className="relative z-10">
                              <div className="mt-4 mb-2 font-bold text-foreground text-lg">
                                {item.label}
                              </div>
                              <p className="font-medium text-muted-foreground/90 text-sm leading-tight">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    )}

                    {/* Menu Items */}
                    {item.items.map((subItem: any) => (
                      <ListItem
                        href={subItem.href}
                        icon={subItem.icon}
                        key={subItem.title}
                        title={subItem.title}
                      >
                        {subItem.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          // Regular Link
          return (
            <NavigationMenuItem key={item.id}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href={item.href}>{item.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        className={cn(
          "group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        href={props.href}
        ref={ref}
        {...props}
      >
        <div className="mb-1 flex items-center gap-2">
          {Icon && (
            <Icon className="h-4 w-4 text-primary transition-colors group-hover:text-foreground" />
          )}
          <div className="font-medium text-sm leading-none">{title}</div>
        </div>
        <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";
