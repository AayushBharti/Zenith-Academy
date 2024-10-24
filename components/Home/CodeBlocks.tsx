import Link from "next/link"
import { TypeAnimation } from "react-type-animation"

import { ButtonOutline, MainButton } from "../ui/ThemeButton"

type CTAButton = {
  active: boolean
  linkto: string
  btnText: React.ReactNode
}

type CodeBlocksProps = {
  position: string
  heading: React.ReactNode
  subheading: React.ReactNode
  ctabtn1: CTAButton
  ctabtn2: CTAButton
  codeblock: string
  backgroudGradient: string
  codeColor: string
}

export default function CodeBlocks({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroudGradient,
  codeColor,
}: CodeBlocksProps) {
  return (
    <section
      className={`flex ${position} my-20 justify-between gap-10 flex-wrap`}
    >
      <div className="flex flex-col gap-8 lg:w-[50%] p-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {heading}
        </h2>
        <p className="text-left text-neutral-600 dark:text-neutral-400 tracking-wide text-base md:text-lg">
          {subheading}
        </p>
        <div className="flex gap-4 mt-8">
          <Link href={ctabtn1.linkto} passHref>
            <MainButton>{ctabtn1.btnText}</MainButton>
          </Link>
          <Link href={ctabtn2.linkto} passHref>
            <ButtonOutline>{ctabtn2.btnText}</ButtonOutline>
          </Link>
        </div>
      </div>

      <div className="w-full lg:w-[500px] h-fit rounded-lg  shadow-lg glass">
        <div className=" text-white p-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {/* <span className="text-sm font-mono">example.js</span> */}
        </div>
        <div className="relative p-4">
          <div
            className={`absolute inset-0 ${backgroudGradient} opacity-20`}
          ></div>
          <div className="flex">
            <div
              className="text-gray-500 font-mono text-sm text-right mr-4 select-none"
              aria-hidden="true"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>
            <div
              className={`flex-1 ${codeColor} font-mono text-sm overflow-x-auto`}
            >
              <TypeAnimation
                sequence={[codeblock, 2000, ""]}
                repeat={Infinity}
                cursor={true}
                style={{
                  whiteSpace: "pre-line",
                  display: "block",
                  overflowX: "hidden",
                  overflowY: "auto",
                  maxHeight: "300px",
                }}
                omitDeletionAnimation={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
