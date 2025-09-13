import type React from "react"
import Link from "next/link"
import { TypeAnimation } from "react-type-animation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CTAButton = {
  active: boolean
  linkto: string
  btnText: React.ReactNode
}

type CodeBlocksProps = {
  position: "flex-row" | "flex-row-reverse"
  heading: React.ReactNode
  subheading: React.ReactNode
  ctabtn1: CTAButton
  ctabtn2: CTAButton
  codeblock: string
  backgroundGradient: string
  codeColor: string
}

export function CodeBlocks({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroundGradient,
  codeColor,
}: CodeBlocksProps) {
  return (
    <section
      className={cn(
        "flex flex-col container mx-auto gap-10 my-20 md:mt-32 px-5",
        position === "flex-row" ? "lg:flex-row" : "lg:flex-row-reverse"
      )}
    >
      <div className="flex flex-col gap-6 lg:w-1/2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
          {heading}
        </h2>
        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400">
          {subheading}
        </p>
        <div className="flex gap-4 mt-6">
          <Button
            asChild
            variant={ctabtn1.active ? "default" : "outline"}
            className="flex-1"
          >
            <Link href={ctabtn1.linkto}>{ctabtn1.btnText}</Link>
          </Button>
          <Button
            asChild
            variant={ctabtn2.active ? "default" : "outline"}
            className="flex-1"
          >
            <Link href={ctabtn2.linkto}>{ctabtn2.btnText}</Link>
          </Button>
        </div>
      </div>

      <div className="w-full lg:w-1/2">
        <div className="rounded-lg shadow-lg overflow-hidden glass">
          <div className="text-gray-800 dark:text-gray-200 p-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            {/* <span className="text-sm font-geistMono">example.js</span> */}
          </div>
          <div className="relative p-4 overflow-hidden">
            <div
              className={cn("absolute inset-0 opacity-20", backgroundGradient)}
            ></div>
            <pre
              className={cn(
                "font-geistMono text-xs overflow-x-auto",
                codeColor
              )}
            >
              <TypeAnimation
                sequence={[codeblock, 5000, ""]}
                repeat={Number.POSITIVE_INFINITY}
                cursor={true}
                // wrapper="code"
                speed={50}
                style={{
                  whiteSpace: "pre-wrap",
                  display: "block",
                  minHeight: "200px",
                  overflowX: "hidden",
                  overflowY: "auto",
                  maxHeight: "300px",
                }}
                omitDeletionAnimation={true}
              />
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
