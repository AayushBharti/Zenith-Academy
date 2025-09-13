import ArrowRight from "./arrow-right"
import { Button } from "./button"

export function MainButton({ children }: { children: React.ReactNode }) {
  return (
    <Button
      variant={"default"}
      className="group flex cursor-pointer text-white items-center bg-blue-600 px-8 py-7 whitespace-nowrap leading-[1.7em] transition-opacity duration-300 hover:opacity-80 space-x-2 hover:bg-blue-700 hover:shadow-lg"
    >
      <p className="font-semibold text-lg text-white transition-all duration-300 group-hover:-translate-x-1 group-hover:text-ocean mr-2">
        {children}
      </p>
      <ArrowRight />
    </Button>
  )
}

export function ButtonOutline({ children }: { children: React.ReactNode }) {
  return (
    <Button
      type="button"
      variant="outline"
      className=" border-2 border-blue-400 bg-transparent px-8 py-7 text-lg font-semibold text-blue-400 transition-all duration-300 ease-out hover:bg-blue-900/30"
    >
      {children}
    </Button>
  )
}
