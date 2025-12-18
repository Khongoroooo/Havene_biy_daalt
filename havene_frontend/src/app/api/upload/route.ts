// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "";
    const filename = (formData.get("filename") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "Файл илгээгдээгүй байна" }, { status: 400 });
    }
    if (!folder || !filename) {
      return NextResponse.json({ error: "folder эсвэл filename шаардлагатай" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // safe path inside public
    const uploadDir = path.join(process.cwd(), "public", folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicPath = `/${folder}/${filename}`.replace(/\\/g, "/");
    return NextResponse.json({ success: true, path: publicPath, message: "Файл хадгалагдлаа" }, { status: 200 });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err?.message ?? "Файл хадгалахад алдаа" }, { status: 500 });
  }
}
