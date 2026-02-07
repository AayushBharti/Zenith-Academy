import HighlightText from "../home/highlighted-text";
import { ButtonOutline, MainButton } from "../ui/theme-button";

export default function HeroAbout() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="container relative z-10 mx-auto px-5">
        <div className="text-center">
          <h1 className="mx-auto max-w-6xl font-extrabold text-4xl tracking-tight sm:text-5xl md:text-7xl dark:text-gray-100">
            Elevate Your Mind with <HighlightText text="ZenithAcademy" />
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-gray-500 text-xl dark:text-gray-300">
            Embark on a transformative learning journey powered by cutting-edge
            AI and expert-crafted content. Unlock your potential in the digital
            age.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <MainButton>Start Your Odyssey</MainButton>
            <ButtonOutline>Explore Courses</ButtonOutline>
          </div>
        </div>
      </div>
      {/* <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-gray-900 to-transparent" /> */}
      <div className="-left-40 -top-40 absolute h-80 w-80 rounded-full bg-blue-900/20 opacity-50 blur-3xl" />
      {/* <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-900/20 opacity-50 blur-3xl" /> */}
    </section>
  );
}
