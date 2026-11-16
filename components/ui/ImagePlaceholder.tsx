import type { ComponentPropsWithoutRef } from "react";

type ImagePlaceholderProps = ComponentPropsWithoutRef<"div"> & {
  label: string;
  aspectRatio?: string;
};

/**
 * Stand-in for the full-bleed photography the "plein cadre" direction needs
 * (hero, founder portrait, architecture band) — no approved shots exist yet
 * (SPEC.md Section 42 keeps this open). Swap for a real next/image inside
 * this box once photography lands; surrounding layout won't need to change.
 */
export function ImagePlaceholder({
  label,
  aspectRatio,
  className = "",
  style,
  ...props
}: ImagePlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-navy/90 to-[#0d1f19] ${className}`}
      style={aspectRatio ? { aspectRatio, ...style } : style}
      {...props}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_28%_18%,#fff,transparent_45%)]"
      />
      <span className="absolute bottom-4 start-4 text-eyebrow uppercase tracking-[0.2em] text-[#ede6d8]/50">
        {label}
      </span>
    </div>
  );
}
