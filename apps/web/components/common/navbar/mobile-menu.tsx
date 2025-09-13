import Link from "next/link"

import { Category } from "@/types/category"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

interface MobileMenuProps {
  navItems: { href: string; label: string }[]
  token: string | null
  categories: Category[]
}

export default function MobileMenu({
  navItems,
  token,
  categories,
}: MobileMenuProps) {
  return (
    <nav className="flex flex-col space-y-4 w-full">
      {navItems.map((item) =>
        item.label === "Courses" ? (
          <Accordion type="single" collapsible key={item.href}>
            <AccordionItem value="courses">
              <AccordionTrigger className="text-lg font-medium">
                Courses
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2 pl-4">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/catalog/${category.name.toLowerCase()}`}
                      className="text-sm"
                    >
                      {category.name}
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
          >
            {item.label}
          </Link>
        )
      )}
      {!token && (
        <div className="flex bottom-0 left-1/2 -translate-x-1/2 gap-2 absolute w-full p-5">
          <Button variant="outline" asChild className="flex-1">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      )}
    </nav>
  )
}
