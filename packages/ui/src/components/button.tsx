import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRightIcon } from "lucide-react";
import { type ComponentProps, cloneElement, isValidElement } from "react";

import { cn } from "../lib/utils";

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-lg font-semibold text-sm transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "btn-gradient-border text-foreground",
        destructive:
          "border border-destructive/50 bg-transparent text-destructive hover:border-destructive hover:bg-destructive/10",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-3",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
      animation: {
        swap: "",
        "slide-in": "",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    iconClassName?: string;
  };

const EASE = "cubic-bezier(1,-0.02,0.01,0.99)";

function Button({
  className,
  variant,
  size,
  animation = "none",
  iconClassName,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const buttonClassName = cn(
    buttonVariants({ variant, size, animation, className })
  );

  // No animation for icon-only buttons or explicit none
  if (animation === "none" || size === "icon") {
    return <Comp className={buttonClassName} {...props} />;
  }

  const arrowCn = cn("size-4", iconClassName);

  // asChild with animations — clone child and inject arrow spans
  if (asChild && isValidElement(props.children)) {
    const child = props.children as React.ReactElement<{
      className?: string;
      children?: React.ReactNode;
    }>;
    const childContent = child.props.children;

    if (animation === "slide-in") {
      return cloneElement(
        child,
        { ...props, className: cn(buttonClassName, child.props.className) },
        <span className="relative flex items-center">
          <span
            className="group-hover/button:-translate-x-2.5 flex items-center transition-transform duration-500"
            style={{ transitionTimingFunction: EASE }}
          >
            {childContent}
          </span>
          <ArrowRightIcon
            className={cn(
              arrowCn,
              "-right-6 group-hover/button:-right-3 absolute ml-1 opacity-0 transition-all duration-500 group-hover/button:opacity-100"
            )}
            style={{ transitionTimingFunction: EASE }}
          />
        </span>
      );
    }

    // Default swap animation
    return cloneElement(
      child,
      { ...props, className: cn(buttonClassName, child.props.className) },
      <span className="relative flex items-center">
        <ArrowRightIcon
          className={cn(
            arrowCn,
            "-left-5 absolute opacity-0 transition-all duration-500 group-hover/button:left-0 group-hover/button:opacity-100"
          )}
          style={{ transitionTimingFunction: EASE }}
        />
        <span
          className="flex items-center transition-transform duration-500 group-hover/button:translate-x-5.5"
          style={{ transitionTimingFunction: EASE }}
        >
          {childContent}
        </span>
        <ArrowRightIcon
          className={cn(
            arrowCn,
            "ml-1.5 transition-all duration-500 group-hover/button:translate-x-[250%] group-hover/button:opacity-0"
          )}
          style={{ transitionTimingFunction: EASE }}
        />
      </span>
    );
  }

  // Not asChild — slide-in
  if (animation === "slide-in") {
    return (
      <Comp className={buttonClassName} {...props}>
        <span className="relative flex items-center">
          <span
            className="group-hover/button:-translate-x-2.5 flex items-center transition-transform duration-500"
            style={{ transitionTimingFunction: EASE }}
          >
            {props.children}
          </span>
          <ArrowRightIcon
            className={cn(
              arrowCn,
              "-right-6 group-hover/button:-right-3 absolute ml-1 opacity-0 transition-all duration-500 group-hover/button:opacity-100"
            )}
            style={{ transitionTimingFunction: EASE }}
          />
        </span>
      </Comp>
    );
  }

  // Not asChild — default swap
  return (
    <Comp className={buttonClassName} {...props}>
      <span className="relative flex items-center">
        <ArrowRightIcon
          className={cn(
            arrowCn,
            "-left-5 absolute opacity-0 transition-all duration-500 group-hover/button:left-0 group-hover/button:opacity-100"
          )}
          style={{ transitionTimingFunction: EASE }}
        />
        <span
          className="flex items-center transition-transform duration-500 group-hover/button:translate-x-5.5"
          style={{ transitionTimingFunction: EASE }}
        >
          {props.children}
        </span>
        <ArrowRightIcon
          className={cn(
            arrowCn,
            "ml-1.5 transition-all duration-500 group-hover/button:translate-x-[250%] group-hover/button:opacity-0"
          )}
          style={{ transitionTimingFunction: EASE }}
        />
      </span>
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
