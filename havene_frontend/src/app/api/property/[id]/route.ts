// src/app/api/property/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!BACKEND) {
      return NextResponse.json(
        { error: "Backend URL тохируулагдаагүй" },
        { status: 500 }
      );
    }

    // Next.js 15+ requires awaiting params
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const token = req.headers.get("authorization") ?? "";

    // Зөв URL: /ul_hudluh/detail/9 (slash-гүй)
    const url = `${BACKEND.replace(/\/+$/, "")}/ul_hudluh/detail/${id}`;
    
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (error) {
    console.error("API property detail error:", error);
    return NextResponse.json(
      { error: "Server алдаа" },
      { status: 500 }
    );
  }
}