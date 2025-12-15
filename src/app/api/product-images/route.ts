// src/app/api/product-images/route.ts
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  try {
    const dir = path.join(
      process.cwd(),
      "public",
      "assets",
      "images",
      "products"
    );

    const files = await fs.readdir(dir);

    const urls = files
      .filter((f) => /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(f))
      .map((f) => `/assets/images/products/${f}`)
      .sort((a, b) => a.localeCompare(b));

    return NextResponse.json(urls);
  } catch (e) {
    console.error("Failed to read product images folder:", e);
    return NextResponse.json([], { status: 200 });
  }
}
