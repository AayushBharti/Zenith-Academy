import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react"

import { FooterLink2 } from "../../data/footer-links"

const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
]
const Plans = ["Paid memberships", "For students", "Business solutions"]
const Community = ["Forums", "Chapters", "Events"]
const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms-of-service" },
  { name: "Cookie Policy", href: "/cookie-policy" },
]
const socialLinks = [
  { Icon: Facebook, href: "https://facebook.com" },
  { Icon: Twitter, href: "https://twitter.com" },
  { Icon: Youtube, href: "https://youtube.com" },
  { Icon: Instagram, href: "https://instagram.com" },
  { Icon: Linkedin, href: "https://linkedin.com" },
]

export default function Footer() {
  return (
    <section id="footer" className="bg-zinc-900">
      <div className="flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-zinc-400 leading-6 mx-auto relative py-14 max-w-[1500px]">
        <div className="border-b w-[100%] flex flex-col lg:flex-row pb-5 border-zinc-700">
          {/* Section 1 */}

          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-zinc-700 pl-3 lg:pr-5 gap-3">
            <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
              <img
                src="/images/Logo/Logo-Full-Light.png"
                alt="zentih Minds"
                className="object-contain"
              />
              <p className="text-sm mb-4">
                Empowering minds through innovative online education.
              </p>
              <h1 className="text-zinc-50 font-semibold text-[16px]">
                Company
              </h1>
              <div className="flex flex-col gap-2">
                {["About", "Careers", "Affiliates"].map((ele, i) => {
                  return (
                    <div
                      key={i}
                      className="text-[14px] cursor-pointer hover:text-zinc-50 transition-all duration-200"
                    >
                      <Link href={ele.toLowerCase()}>{ele}</Link>
                    </div>
                  )
                })}
              </div>
              <div className="flex space-x-4 mt-4">
                {socialLinks.map(({ Icon, href }, index) => (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-300 hover:text-zinc-50 transition-colors duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-zinc-50 font-semibold text-[16px]">
                Resources
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Resources.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-zinc-50 transition-all duration-200"
                    >
                      <Link href={ele.split(" ").join("-").toLowerCase()}>
                        {ele}
                      </Link>
                    </div>
                  )
                })}
              </div>

              <h1 className="text-zinc-50 font-semibold text-[16px] mt-7">
                Support
              </h1>
              <div className="text-[14px] cursor-pointer hover:text-zinc-50 transition-all duration-200 mt-2">
                <Link href={"/help-center"}>Help Center</Link>
              </div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0 hidden md:block">
              <h1 className="text-zinc-50 font-semibold text-[16px]">Plans</h1>

              <div className="flex flex-col gap-2 mt-2">
                {Plans.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-zinc-50 transition-all duration-200"
                    >
                      <Link href={ele.split(" ").join("-").toLowerCase()}>
                        {ele}
                      </Link>
                    </div>
                  )
                })}
              </div>
              <h1 className="text-zinc-50 font-semibold text-[16px] mt-7">
                Community
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Community.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-zinc-50 transition-all duration-200"
                    >
                      <Link href={ele.split(" ").join("-").toLowerCase()}>
                        {ele}
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="lg:w-[50%] md:flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3 hidden">
            {FooterLink2.map((ele, i) => {
              return (
                <div key={i} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                  <h1 className="text-zinc-50 font-semibold text-[16px]">
                    {ele.title}
                  </h1>
                  <div className="flex flex-col gap-2 mt-2">
                    {ele.links.map((link, index) => {
                      return (
                        <div
                          key={index}
                          className="text-[14px] cursor-pointer hover:text-zinc-50 transition-all duration-200"
                        >
                          <Link href={link.link}>{link.title}</Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="pb-8 flex flex-col md:flex-row justify-between items-center w-11/12 mx-auto text-zinc-400">
        <div className="text-sm mb-4 md:mb-0">
          © {new Date().getFullYear()} Zenith Minds. All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-4">
          {legalLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-sm hover:text-zinc-50 transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
