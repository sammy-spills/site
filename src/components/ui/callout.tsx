import { cn } from "@/lib/utils";

function Callout({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      className={cn(
        "not-prose my-6 rounded-r-lg border-primary border-l-4 bg-muted/50 px-5 py-4",
        className
      )}
      {...props}
    />
  );
}

function CalloutTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-semibold text-foreground text-sm tracking-wide",
        className
      )}
      {...props}
    />
  );
}

function CalloutDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mt-1 text-muted-foreground text-sm [&_a]:text-primary [&_a]:underline",
        className
      )}
      {...props}
    />
  );
}

export { Callout, CalloutTitle, CalloutDescription };
