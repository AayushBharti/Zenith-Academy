import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Category } from "@/types/category"

interface MobileMenuProps {
  navItems: { href: string; label: string }[]
  token: string | null
  categories: Category[]
}

export default function MobileMenu({ navItems, token, categories }: MobileMenuProps) {
  return (
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
  )
}

