import type { ComponentPropsWithoutRef } from "react";
import Image from "next/image";

type ImagePlaceholderProps = ComponentPropsWithoutRef<"div"> & {
  label: string;
  aspectRatio?: string;
  /** Generic stand-in photo while real photography is pending — swap for
   * the final shot by changing this prop only; surrounding layout and the
   * no-`src` "pending" gradient (still used where no stand-in exists yet,
   * e.g. the founder portrait) don't need to change.
   *
   * `/brand/placeholder-jerusalem.jpg` (used in Hero/PracticeList): cropped
   * from "2013-Jerusalem-View from Armon Hanatziv.jpg", Wikimedia Commons,
   * CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:2013-Jerusalem-View_from_Armon_Hanatziv.jpg.
   * Replace (and drop this note) once real photography lands. */
  src?: string;
};

/**
 * Stand-in for the full-bleed photography the "plein cadre" direction needs
 * (hero, founder portrait, architecture band) — no approved shots exist yet
 * (SPEC.md Section 42 keeps this open).
 */
export function ImagePlaceholder({
  label,
  aspectRatio,
  src,
  className = "",
  style,
  ...props
}: ImagePlaceholderProps) {
  if (src) {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={aspectRatio ? { aspectRatio, ...style } : style}
        {...props}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

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
