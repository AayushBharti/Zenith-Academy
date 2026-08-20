import { cn } from "@workspace/ui/lib/utils";

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function DashboardPageHeader({
  title,
  description,
  children,
  className,
}: DashboardPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 md:flex-row md:items-center",
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="font-bold text-3xl tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex shrink-0 items-center">{children}</div>}
    </div>
  );
}
