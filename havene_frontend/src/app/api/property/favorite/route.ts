// src/app/api/property/favorite/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    if (!BACKEND) {
      return NextResponse.json(
        { error: "Backend URL тохируулагдаагүй" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const token = req.headers.get("authorization") ?? "";

    const url = `${BACKEND.replace(/\/+$/, "")}/ul_hudluh/favorite`;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (error) {
    console.error("API favorite error:", error);
    return NextResponse.json(
      { error: "Server алдаа" },
      { status: 500 }
    );
  }
}