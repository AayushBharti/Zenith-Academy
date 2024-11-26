import { Book } from "lucide-react"

import { Category } from "@/types/category"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { ListItem } from "./ListItem"

export default function DesktopMenu({
  categories,
}: {
  categories: Category[]
}) {
  return (
    <nav className="hidden md:flex flex-1">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-6 md:w-[500px] lg:w-[700px] xl:w-[1000px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] min-w-[300px]">
                <div className="row-span-3 col-span-full xl:col-span-1">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <Book className="h-6 w-6" aria-hidden="true" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        EdTech Courses
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Discover our wide range of online courses to boost your
                        skills.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </div>
                {categories.map((category) => (
                  <ListItem
                    key={category._id}
                    href={`/catalog/${category.name.toLowerCase()}`}
                    title={category.name}
                  >
                    {category.description}
                  </ListItem>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/about"
              className={navigationMenuTriggerStyle()}
            >
              About
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/contact"
              className={navigationMenuTriggerStyle()}
            >
              Contact
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}
