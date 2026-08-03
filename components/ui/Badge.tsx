import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex w-fit bg-tertiary px-2 py-0.5 font-headline text-xs uppercase tracking-wide text-white">
      {children}
    </span>
  );
}
