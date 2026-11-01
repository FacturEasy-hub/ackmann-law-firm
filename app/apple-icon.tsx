import { ImageResponse } from "next/og";
import { monogramDataUri } from "@/lib/brand-assets";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#031427",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og's ImageResponse renders via satori, not the DOM; next/image isn't usable here. */}
        <img src={monogramDataUri} width={130} height={105} alt="" />
      </div>
    ),
    size,
  );
}
