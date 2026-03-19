import { cn } from "@/lib/utils";

interface ProseProps {
  children: React.ReactNode;
  className?: string;
}

export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn("prose dark:prose-invert prose-lg max-w-prose", className)}
    >
      {children}
    </div>
  );
}
