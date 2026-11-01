import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { wedding } from "@/config/wedding";
import { weddingDateLabel } from "@/lib/wedding-data";

export const alt = `Wedding invitation of ${wedding.groom.name} and ${wedding.bride.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fonts = path.join(process.cwd(), "src/assets/fonts");

export default async function OpengraphImage() {
  const [regular, italic] = await Promise.all([
    readFile(path.join(fonts, "CormorantGaramond-Regular.ttf")),
    readFile(path.join(fonts, "CormorantGaramond-Italic.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #48141F 0%, #651E2B 100%)",
          color: "#FAF5EC",
          fontFamily: "Cormorant",
        }}
      >
        <div style={{ position: "absolute", top: 28, left: 28, right: 28, bottom: 28, border: "1px solid rgba(197,161,91,0.55)", display: "flex" }} />
        <div style={{ position: "absolute", top: 38, left: 38, right: 38, bottom: 38, border: "1px solid rgba(197,161,91,0.25)", display: "flex" }} />
        <div style={{ fontSize: 22, letterSpacing: 8, color: "#DCC58E", textTransform: "uppercase" }}>
          You are invited to the wedding of
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 34, fontSize: 80, padding: "0 70px", textAlign: "center", lineHeight: 1 }}>
          <span>{wedding.groom.name}</span>
          <span style={{ fontStyle: "italic", color: "#C5A15B", fontSize: 72 }}>&amp;</span>
          <span>{wedding.bride.name}</span>
        </div>
        <div style={{ display: "flex", width: 160, height: 1, background: "#C5A15B", marginTop: 40 }} />
        <div style={{ marginTop: 30, fontSize: 34, fontStyle: "italic", color: "#DCC58E" }}>{weddingDateLabel}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: regular, style: "normal", weight: 400 },
        { name: "Cormorant", data: italic, style: "italic", weight: 400 },
      ],
    },
  );
}
