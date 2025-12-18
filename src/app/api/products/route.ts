// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";

type ProductCreatePayload = {
  pid: string;

  position?: number;

  name: string;
  nameFr?: string;
  nameNl?: string;

  headline?: string;
  headlineFr?: string;
  headlineNl?: string;

  summary?: string;
  summaryFr?: string;
  summaryNl?: string;

  description?: string;
  descriptionFr?: string;
  descriptionNl?: string;

  bulletPoints?: string[];
  images?: string[];

  price?: number;
  visible?: boolean;
};

export async function GET() {
  try {
    await connectToDatabase();

    // Sort by position first (lowest first), fallback to createdAt
    const products = await Product.find()
      .sort({ position: 1, createdAt: 1 })
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error("[GET /api/products] Error:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = (await req.json()) as ProductCreatePayload;

    if (!body?.pid?.trim() || !body?.name?.trim()) {
      return NextResponse.json(
        { message: "pid and name are required" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      pid: body.pid.trim(),

      position: typeof body.position === "number" ? body.position : undefined,

      name: body.name.trim(),
      nameFr: body.nameFr ?? "",
      nameNl: body.nameNl ?? "",

      headline: body.headline ?? "",
      headlineFr: body.headlineFr ?? "",
      headlineNl: body.headlineNl ?? "",

      summary: body.summary ?? "",
      summaryFr: body.summaryFr ?? "",
      summaryNl: body.summaryNl ?? "",

      description: body.description ?? "",
      descriptionFr: body.descriptionFr ?? "",
      descriptionNl: body.descriptionNl ?? "",

      bulletPoints: Array.isArray(body.bulletPoints) ? body.bulletPoints : [],
      images: Array.isArray(body.images) ? body.images : [],

      price: typeof body.price === "number" ? body.price : undefined,

      visible: body.visible ?? true,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("[POST /api/products] Error:", error);
    return NextResponse.json(
      { message: "Error creating product" },
      { status: 500 }
    );
  }
}
