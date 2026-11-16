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
   * All current stand-ins are cropped CC-licensed Wikimedia Commons photos
   * (per-practice-area mapping lives in `PracticeList.tsx`'s
   * `practiceImages`) — replace (and drop this note) once real
   * photography lands.
   *
   * `/brand/placeholder-jerusalem.jpg` (Hero; also Banking & Finance's
   * fallback in PracticeList): cropped from "2013-Jerusalem-View from Armon
   * Hanatziv.jpg", CC BY-SA 4.0 —
   * https://commons.wikimedia.org/wiki/File:2013-Jerusalem-View_from_Armon_Hanatziv.jpg
   * `/brand/practice-corporate.jpg`: cropped from "Chairs in a meeting room
   * (Unsplash).jpg", CC0 —
   * https://commons.wikimedia.org/wiki/File:Chairs_in_a_meeting_room_(Unsplash).jpg
   * `/brand/practice-compliance.jpg`: cropped from "Legal Contract &
   * Signature - Warm Tones.jpg", CC BY 2.0 —
   * https://commons.wikimedia.org/wiki/File:Legal_Contract_%26_Signature_-_Warm_Tones.jpg
   * `/brand/practice-admin.jpg`: cropped from "Austrian Parliament
   * Building.jpg", CC BY-SA 3.0 —
   * https://commons.wikimedia.org/wiki/File:Austrian_Parliament_Building.jpg
   * `/brand/practice-dispute.jpg`: cropped from "Courtroom One Gavel -
   * Flickr - Joe Gratz.jpg", CC0 —
   * https://commons.wikimedia.org/wiki/File:Courtroom_One_Gavel_-_Flickr_-_Joe_Gratz.jpg
   * `/brand/practice-private.jpg`: cropped from "Ardmore Residential Units,
   * Fremantle, July 2023 01.jpg", CC BY-SA 4.0 —
   * https://commons.wikimedia.org/wiki/File:Ardmore_Residential_Units,_Fremantle,_July_2023_01.jpg */
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
