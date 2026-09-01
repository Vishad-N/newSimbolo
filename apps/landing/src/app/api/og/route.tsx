import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "The Simbolo";
  const subtitle = searchParams.get("subtitle") || "Digital Marketing Agency";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #050816 0%, #0B1120 60%, #0F172A 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#22D3EE",
            }}
          />
          <div style={{ fontSize: 28, fontWeight: 700, color: "#22D3EE", letterSpacing: -0.5 }}>THE SIMBOLO</div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.15,
            letterSpacing: -1.5,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#94A3B8", marginTop: 24 }}>{subtitle}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
