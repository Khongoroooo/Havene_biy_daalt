// src/app/api/property/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    if (!BACKEND) {
      return NextResponse.json({ error: "NEXT_PUBLIC_API_URL тохируулагдаагүй байна" }, { status: 500 });
    }

    const body = await req.json();
    const auth = req.headers.get("authorization") || "";

    const backendUrl = `${BACKEND.replace(/\/+$/, "")}/ul_hudluh/`;

    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json().catch(() => ({}));
    return NextResponse.json(data, { status: resp.status });
  } catch (e: any) {
    console.error("/api/property proxy error:", e);
    return NextResponse.json({ error: e?.message ?? "API proxy алдаа" }, { status: 500 });
  }
}
