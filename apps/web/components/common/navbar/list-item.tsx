import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export const ListItem = ({
  className,
  title,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & { title: string }) => (
  <NavigationMenuLink asChild>
    <a
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    >
      <div className="font-medium text-sm leading-none">{title}</div>
      <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
        {children}
      </p>
    </a>
  </NavigationMenuLink>
);
