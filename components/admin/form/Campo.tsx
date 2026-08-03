import type { ReactNode } from "react";

interface CampoProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export function Campo({ label, htmlFor, error, children }: CampoProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="font-label text-xs uppercase tracking-[0.1em] text-on-surface/70"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="font-label text-xs text-tertiary">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const INPUT_CLASES =
  "w-full border border-white/15 bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-on-surface/40 outline-none transition-colors focus:border-secondary";

export const TEXTAREA_CLASES = `${INPUT_CLASES} min-h-28 resize-y`;
