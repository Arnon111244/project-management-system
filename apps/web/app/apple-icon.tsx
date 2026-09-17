import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#02c0ce",
        color: "#ffffff",
        fontSize: 96,
        fontWeight: 700,
        borderRadius: 40,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      N
    </div>,
    { ...size },
  );
}
