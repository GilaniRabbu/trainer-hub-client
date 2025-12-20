import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  className?: string;
}

export function SectionTitle({ title, className }: SectionTitleProps) {
  return (
    <div>
      <h2
        className={cn(
          "mb-10 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-primary text-balance",
          className
        )}
      >
        {title}
      </h2>
    </div>
  );
}
