import { MainButton } from "../ui/theme-button"
import HighlightText from "./highlighted-text"

export default function InstructorSection() {
  return (
    <div className="flex flex-col md:flex-row gap-20 items-center my-16">
      <img
        src="/assets/instructor.png"
        alt="Instructor Image"
        className="h-[500px] transform-gpu rounded-3xl object-cover transition-all duration-300 md:w-[50%]"
      />

      <div className="md:w-[50%] flex flex-col gap-7">
        <div className="font-semibold text-4xl text-neutral-800 tracking-tighter dark:text-neutral-300">
          Become an <HighlightText text={" ZenithAcademy Instructor "} />
        </div>

        <p className="text-left text-neutral-400 tracking-wide text-sm py-4 md:text-lg">
          Join a global community of educators and teach millions of students
          from around the world. Whether you&apos;re a professional or industry
          expert, ZenithAcademy gives you the tools to create courses, share
          your knowledge, and grow your teaching career. With our platform, you
          can design interactive lessons, offer feedback, and connect with
          learners everywhere. Start teaching what you love and make an impact
          today!
          <br />
          <br />
          Empower students from every corner of the world and take the next step
          in your journey as an instructor today!
        </p>

        <div className="w-fit">
          <MainButton>Start Learning Today</MainButton>
        </div>
      </div>
    </div>
  )
}
