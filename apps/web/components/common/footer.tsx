"use client"

import Link from "next/link"
import {
  ArrowRight,
  Book,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react"
import toast from "react-hot-toast"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const footerSections = [
  {
    title: "Courses",
    links: [
      { name: "Web Development", href: "/catalog/web developement" },
      { name: "AI and Machine Learning", href: "/catalog/machine learning" },
      { name: "Blockchain", href: "/catalog/blockchain development" },
      { name: "Android Development", href: "/catalog/android development" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Blog", href: "/" },
      { name: "Podcast", href: "/" },
      { name: "eBooks", href: "/" },
      { name: "Learning Paths", href: "/" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Forums", href: "/" },
      { name: "Events", href: "/" },
      { name: "Student Showcase", href: "/" },
      { name: "Mentorship", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/about" },
      { name: "Partners", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
  },
]

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms-of-service" },
  { name: "Cookie Policy", href: "/cookie-policy" },
]

const socialLinks = [
  { Icon: Facebook, href: "https://facebook.com", name: "Facebook" },
  { Icon: Twitter, href: "https://twitter.com", name: "Twitter" },
  { Icon: Youtube, href: "https://youtube.com", name: "YouTube" },
  { Icon: Instagram, href: "https://instagram.com", name: "Instagram" },
  { Icon: Linkedin, href: "https://linkedin.com", name: "LinkedIn" },
]
function submitHandler() {
  console.log("Newsletter Handler")
  toast.success("Newsletter Subscribed!")
}
export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-950 dark:to-neutral-800 text-neutral-800 dark:text-neutral-200 mt-8 w-full">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mr-6 mb-4">
              <Book className="h-6 w-6 mr-2" aria-hidden="true" />
              <span className="font-bold text-lg">Zenith Academy</span>
            </Link>
            <p className="text-sm mb-6 max-w-sm">
              Empowering learners worldwide through innovative online education
              and cutting-edge technology.
            </p>
            <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
            <form
              action={() => {
                submitHandler()
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <div className="flex-grow">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
              <Button type="submit" variant="default" className="group">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="hidden lg:block">
              <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-primary dark:hover:text-primary/75 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <Accordion type="single" collapsible className="lg:hidden">
            {footerSections.map((section) => (
              <AccordionItem value={section.title} key={section.title}>
                <AccordionTrigger className="text-lg font-semibold">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm hover:text-primary dark:hover:text-primary/75 transition-colors duration-300"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Separator className="mb-8 bg-gray-300 dark:bg-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm order-2 md:order-1">
            © {new Date().getFullYear()} Zenith Academy. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 order-3 md:order-2">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm hover:text-primary dark:hover:text-primary/75 transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex gap-4 order-1 md:order-3 mb-4 md:mb-0">
            {socialLinks.map(({ Icon, href, name }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary/75 transition-colors duration-300"
              >
                <Icon className="w-5 h-5" />
                <span className="sr-only">{name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
