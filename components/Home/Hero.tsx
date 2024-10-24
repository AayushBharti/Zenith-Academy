import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { ButtonOutline, MainButton } from "../ui/ThemeButton"
import HighlightText from "./HighlightedText"

export default function Hero() {
  return (
    <div className="flex mt-20 mb-20 flex-col justify-center items-center [mask-image:linear-gradient(to_top,transparent,black_50%)]">
      <Link href={"/signup"}>
        <div className="flex items-center gap-2 mb-1.5 rounded-full bg-gray-800/40 px-3 py-1.5 text-sm">
          <p>Become an Instructor</p>
          <ChevronRight className="w-4 h-4" />
        </div>
      </Link>

      <h1 className="text-center bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-[6rem] translate-y-[-1rem] md:max-w-[80%]">
        Unlock Your Potential with In-Demand{" "}
        <HighlightText text={"Coding Skills"} />
      </h1>

      <p className="mb-12 mt-2 text-lg md:text-xl text-balance translate-y-[-1rem] text-center max-w-[65%]  text-neutral-400 tracking-wide ">
        Learn to code at your own pace, anywhere, with access to hands-on
        projects, quizzes, and personalized feedback from expert instructors.
      </p>

      <div className="flex flex-row gap-7 mt-2">
        <MainButton>Learn More</MainButton>
        <ButtonOutline>Book a Demo</ButtonOutline>
      </div>

      <video
        className="mx-3 mt-20 rounded-t-3xl relative w-[80%]"
        muted
        loop
        autoPlay
      >
        <source src="/images/banner.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
