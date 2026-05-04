import { cn } from "@/lib/utils";

export function controlNavLinkClassName(
  active: boolean,
  layout: "sidebar" | "mobile" | "strip"
) {
  const focus =
    "outline-none transition-[color,background-color,transform] duration-200 focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  if (layout === "strip") {
    return cn(
      focus,
      "touch-manipulation select-none whitespace-nowrap rounded-full px-4 py-3 text-[13px] font-medium tracking-tight active:scale-[0.98] sm:px-3.5 sm:py-2 sm:text-[12px]",
      active
        ? "border border-primary/25 bg-primary/[0.12] text-primary"
        : "border border-transparent bg-white/[0.03] text-muted-foreground hover:border-white/[0.08] hover:bg-white/[0.06] hover:text-foreground"
    );
  }

  if (layout === "sidebar") {
    return cn(
      focus,
      "relative flex w-full items-center rounded-xl py-2.5 pl-3 pr-2 text-[13px] font-medium leading-snug tracking-tight",
      active
        ? "bg-white/[0.06] text-foreground before:absolute before:left-0 before:top-1/2 before:h-[55%] before:w-px before:-translate-y-1/2 before:rounded-full before:bg-primary"
        : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
    );
  }

  return cn(
    focus,
    "flex w-full items-center rounded-xl px-3 py-3 text-[15px] font-medium leading-snug tracking-tight",
    active ? "bg-white/[0.07] text-foreground" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
  );
}
