import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Inlined as a data URI for next/og ImageResponse and the SVG favicon —
 * those render outside the normal asset pipeline, so a `/brand/...` URL
 * won't resolve there. PNG, not webp: satori (next/og's renderer) can't
 * decode webp raster images.
 */
export const monogramDataUri = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/brand/ja-monogram.png"),
).toString("base64")}`;
