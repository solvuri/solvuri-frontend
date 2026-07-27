import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0F0E2A",
      }}
    >
      <div
        style={{
          fontSize: 104,
          fontWeight: 700,
          color: "#FFFFFF",
          letterSpacing: -2,
        }}
      >
        SOLVURI
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#9896B8",
          marginTop: 16,
        }}
      >
        Modular Business Infrastructure
      </div>
    </div>,
    { ...size },
  );
}
