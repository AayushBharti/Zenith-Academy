'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuthStore } from "@/store/useAuthStore"
import { useCartStore } from "@/store/useCartStore"
import { apiConnector } from "@/utils/apiConnector"
import { categories } from "@/utils/apis"
import { Book, Menu, ShoppingCart } from "lucide-react"

import { Category } from "@/types/category"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ProfileDropdown from "@/components/Auth/ProfileDropDown"

import { ModeToggle } from "../ModeToggle"
import DesktopMenu from "./DesktopMenu"
import MobileMenu from "./MobileMenu"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const { token } = useAuthStore()
  const { totalItems } = useCartStore()
  const [sublinks, setSublinks] = useState<Category[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
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

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 mx-auto flex h-14 items-center">
        <Link href="/" className="flex items-center mr-6">
          <Book className="h-6 w-6 mr-2" aria-hidden="true" />
          <span className="font-bold text-lg">Zenith Academy</span>
        </Link>

        <DesktopMenu categories={sublinks} />

        <div className="flex flex-1 items-center justify-end space-x-4">
          <ModeToggle />
          {isClient && <CartAndProfile token={token} totalItems={totalItems} />}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <MobileMenu
                navItems={navItems}
                token={token}
                categories={sublinks}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
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
      <Button variant="outline" size="icon" className="relative" asChild>
        <Link href="/dashboard/cart">
          <ShoppingCart className="h-4 w-4" />
          <span className="sr-only">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </Button>
      <ProfileDropdown />
    </>
  )
}

