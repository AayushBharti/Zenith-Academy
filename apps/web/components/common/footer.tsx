"use client";

import {
  Book,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

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
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms-of-service" },
  { name: "Cookie Policy", href: "/cookie-policy" },
];

const socialLinks = [
  { Icon: Facebook, href: "https://facebook.com", name: "Facebook" },
  { Icon: Twitter, href: "https://twitter.com", name: "Twitter" },
  { Icon: Youtube, href: "https://youtube.com", name: "YouTube" },
  { Icon: Instagram, href: "https://instagram.com", name: "Instagram" },
  { Icon: Linkedin, href: "https://linkedin.com", name: "LinkedIn" },
];
function submitHandler() {
  console.log("Newsletter Handler");
  toast.success("Newsletter Subscribed!");
}
export default function Footer() {
  return (
    <footer className="mt-8 w-full bg-linear-to-br from-neutral-100 to-neutral-200 text-neutral-800 dark:from-neutral-950 dark:to-neutral-800 dark:text-neutral-200">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link className="mr-6 mb-4 flex items-center" href="/">
              <Book aria-hidden="true" className="mr-2 h-6 w-6" />
              <span className="font-bold text-lg">Zenith Academy</span>
            </Link>
            <p className="mb-6 max-w-sm text-sm">
              Empowering learners worldwide through innovative online education
              and cutting-edge technology.
            </p>
            {/* <h3 className="text-xl font-semibold mb-4">Stay Updated</h3> */}
            {/* <form
              action={() => {
                submitHandler()
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <div className="grow">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 h-10"
                />
              </div>
              <Button type="submit" variant="default" className="group h-10">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form> */}
          </div>

          {footerSections.map((section) => (
            <div className="hidden lg:block" key={section.title}>
              <h3 className="mb-4 font-semibold text-xl">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      className="text-sm transition-colors duration-300 hover:text-primary dark:hover:text-primary/75"
                      href={link.href}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <Accordion className="lg:hidden" collapsible type="single">
            {footerSections.map((section) => (
              <AccordionItem key={section.title} value={section.title}>
                <AccordionTrigger className="font-semibold text-lg">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          className="text-sm transition-colors duration-300 hover:text-primary dark:hover:text-primary/75"
                          href={link.href}
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

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="order-2 text-sm md:order-1">
            © {new Date().getFullYear()} Zenith Academy. All rights reserved.
          </div>
          <div className="order-3 flex flex-wrap justify-center gap-4 md:order-2">
            {legalLinks.map((link) => (
              <Link
                className="text-sm transition-colors duration-300 hover:text-primary dark:hover:text-primary/75"
                href={link.href}
                key={link.name}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="order-1 mb-4 flex gap-4 md:order-3 md:mb-0">
            {socialLinks.map(({ Icon, href, name }) => (
              <a
                className="text-gray-600 transition-colors duration-300 hover:text-primary dark:text-gray-400 dark:hover:text-primary/75"
                href={href}
                key={name}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
