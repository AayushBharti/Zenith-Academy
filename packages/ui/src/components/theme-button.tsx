import ArrowRight from "./arrow-right";
import { Button } from "./button";

export function MainButton({ children }: { children: React.ReactNode }) {
  return (
    <Button
      className="group flex cursor-pointer items-center space-x-2 whitespace-nowrap bg-blue-600 px-8 py-7 text-white leading-[1.7em] transition-opacity duration-300 hover:bg-blue-700 hover:opacity-80 hover:shadow-lg"
      variant={"default"}
    >
      <p className="group-hover:-translate-x-1 mr-2 font-semibold text-lg text-white transition-all duration-300 group-hover:text-ocean">
        {children}
      </p>
      <ArrowRight />
    </Button>
  );
}

export function ButtonOutline({ children }: { children: React.ReactNode }) {
  return (
    <Button
      className="border-2 border-blue-400 bg-transparent px-8 py-7 font-semibold text-blue-400 text-lg transition-all duration-300 ease-out hover:bg-blue-900/30"
      type="button"
      variant="outline"
    >
      {children}
    </Button>
  );
}
