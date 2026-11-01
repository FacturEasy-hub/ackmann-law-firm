import { ImageResponse } from "next/og";
import { monogramDataUri } from "@/lib/brand-assets";

/**
 * Reusable Open Graph visual template (SPEC.md Section 12/29) — white
 * background, navy type, brass eyebrow, JA monogram. Generated at
 * request/build time via next/og — no photography dependency, since none
 * exists yet (see Hero/FounderSection deferral notes).
 */
export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

export function renderOgImage({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        padding: "80px",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- next/og's ImageResponse renders via satori, not the DOM; next/image isn't usable here. */}
      <img
        src={monogramDataUri}
        width={89}
        height={72}
        alt=""
        style={{ marginBottom: 48, borderRadius: 4 }}
      />
      <div
        style={{
          display: "flex",
          fontSize: 28,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#b3976c",
          marginBottom: 24,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 62,
          lineHeight: 1.15,
          fontFamily: "serif",
          color: "#031427",
          maxWidth: 950,
        }}
      >
        {title}
      </div>
    </div>,
    ogImageSize,
  );
}
