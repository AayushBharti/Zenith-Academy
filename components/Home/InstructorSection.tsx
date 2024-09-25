import ArrowRight from "../UI/ArrowRight"
import { Button } from "../UI/button"
import HighlightText from "./HighlightedText"

export default function InstructorSection() {
  return (
    <div className="flex flex-col md:flex-row gap-20 items-center my-16">
      <img
        src="/images/instructor.png"
        alt="Instructor Image"
        className="h-[500px] transform-gpu rounded-3xl object-cover transition-all duration-300 md:w-[50%]"
      />

      <div className="md:w-[50%] flex flex-col gap-7">
        <div className="font-semibold text-4xl text-neutral-800 tracking-tighter dark:text-neutral-300">
          Become an <HighlightText text={" ZenithMinds Instructor "} />
        </div>

        <p className="text-left text-neutral-400 tracking-wide text-sm py-4 md:text-lg">
          Join a global community of educators and teach millions of students
          from around the world. Whether you&apos;re a professional or industry
          expert, StudyNotion gives you the tools to create courses, share your
          knowledge, and grow your teaching career. With our platform, you can
          design interactive lessons, offer feedback, and connect with learners
          everywhere. Start teaching what you love and make an impact today!
          <br />
          <br />
          Empower students from every corner of the world and take the next step
          in your journey as an instructor today!
        </p>

        <div className="w-fit">
          <Button
            variant={"default"}
            className="group flex cursor-pointer items-center whitespace-nowrap leading-[1.7em] transition-opacity duration-300 hover:opacity-80 space-x-2"
          >
            <p className="font-semibold transition-all duration-300 group-hover:-translate-x-1 group-hover:text-ocean mr-2">
              Start Learning Today
            </p>
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  )
}