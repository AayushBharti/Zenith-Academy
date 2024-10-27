"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuthStore } from "@/store/useAuthStore"
import { useCartStore } from "@/store/useCartStore"
import { apiConnector } from "@/utils/apiConnector"
import { categories } from "@/utils/apis"
import { Book, Menu, ShoppingCart } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ProfileDropdown from "@/components/Auth/ProfileDropDown"

interface Category {
  _id: string
  name: string
  description: string
}

export default function Navbar() {
  const { token } = useAuthStore()
  const { totalItems } = useCartStore()
  const [isOpen, setIsOpen] = useState(false)
  const [sublinks, setSublinks] = useState<Category[]>([])

  useEffect(() => {
    const fetchSublinks = async () => {
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API)
        setSublinks(result.data.data)
        localStorage.setItem("sublinks", JSON.stringify(result.data.data))
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchSublinks()
  }, [])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex max-w-[1450px] h-14 items-center mx-auto">
        <Link href="/" className="flex items-center mr-6">
          <Book className="h-6 w-6 mr-2" />
          <span className="font-bold text-lg">Zenith Minds</span>
        </Link>

        <DesktopMenu sublinks={sublinks} />

        <div className="flex flex-1 items-center justify-end space-x-4">
          <CartAndProfile token={token} totalItems={totalItems} />
          <MobileMenu
            navItems={navItems}
            token={token}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            sublinks={sublinks}
          />
        </div>
      </div>
    </header>
  )
}

function DesktopMenu({ sublinks }: { sublinks: Category[] }) {
  return (
    <div className="hidden md:flex flex-1">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <Book className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        EdTech Courses
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Discover our wide range of online courses to boost your
                        skills.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                {sublinks.map((catalog) => (
                  <ListItem
                    key={catalog._id}
                    href={`/catalog/${catalog.name.toLowerCase()}`}
                    title={catalog.name}
                  >
                    {catalog.description}
                  </ListItem>
                ))}
              </ul>
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
    </div>
  )
}

function CartAndProfile({
  token,
  totalItems,
}: {
  token: string | null
  totalItems: number
}) {
  if (!token) {
    return (
      <>
        <Button variant="ghost" asChild className="hidden sm:inline-flex">
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild className="hidden sm:inline-flex">
          <Link href="/signup">Sign up</Link>
        </Button>
      </>
    )
  }

  return (
    <>
      <Link href="/dashboard/cart">
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          <span className="sr-only">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </Link>
      <ProfileDropdown />
    </>
  )
}

function MobileMenu({
  navItems,
  token,
  isOpen,
  setIsOpen,
  sublinks,
}: {
  navItems: { href: string; label: string }[]
  token: string | null
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  sublinks: Category[]
}) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <nav className="flex flex-col space-y-4">
          {navItems.map((item) =>
            item.label === "Courses" ? (
              <Accordion type="single" collapsible key={item.href}>
                <AccordionItem value="courses">
                  <AccordionTrigger className="text-lg font-medium">
                    Courses
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2 pl-4">
                      {sublinks.map((sublink) => (
                        <Link
                          key={sublink._id}
                          href={`/catalog/${sublink.name.toLowerCase()}`}
                          className="text-sm"
                          onClick={() => setIsOpen(false)}
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
          {!token && (
            <>
              <Button variant="ghost" asChild className="justify-start">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="justify-start">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

const ListItem = ({
  className,
  title,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & { title: string }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
