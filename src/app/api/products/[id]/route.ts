// src/app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { ApiRouteContext } from "@/types/ApiParams";
import { getRouteId } from "@/lib/getRouteId";

type ProductUpdatePayload = {
  pid?: string;

  position?: number;

  name?: string;
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

export async function PUT(req: Request, context: ApiRouteContext) {
  try {
    await connectToDatabase();

    const id = await getRouteId(context);
    const body = (await req.json()) as ProductUpdatePayload;

    // Allow only known fields to be updated
    const update: ProductUpdatePayload = {
      pid: typeof body.pid === "string" ? body.pid.trim() : undefined,

      position: typeof body.position === "number" ? body.position : undefined,

      name: typeof body.name === "string" ? body.name : undefined,
      nameFr: typeof body.nameFr === "string" ? body.nameFr : undefined,
      nameNl: typeof body.nameNl === "string" ? body.nameNl : undefined,

      headline: typeof body.headline === "string" ? body.headline : undefined,
      headlineFr: typeof body.headlineFr === "string" ? body.headlineFr : undefined,
      headlineNl: typeof body.headlineNl === "string" ? body.headlineNl : undefined,

      summary: typeof body.summary === "string" ? body.summary : undefined,
      summaryFr: typeof body.summaryFr === "string" ? body.summaryFr : undefined,
      summaryNl: typeof body.summaryNl === "string" ? body.summaryNl : undefined,

      description: typeof body.description === "string" ? body.description : undefined,
      descriptionFr: typeof body.descriptionFr === "string" ? body.descriptionFr : undefined,
      descriptionNl: typeof body.descriptionNl === "string" ? body.descriptionNl : undefined,

      bulletPoints: Array.isArray(body.bulletPoints) ? body.bulletPoints : undefined,
      images: Array.isArray(body.images) ? body.images : undefined,

      price: typeof body.price === "number" ? body.price : undefined,
      visible: typeof body.visible === "boolean" ? body.visible : undefined,
    };

    // Remove undefined so we don't overwrite existing values accidentally
    (Object.keys(update) as Array<keyof ProductUpdatePayload>).forEach((k) => {
      if (update[k] === undefined) delete update[k];
    });

    const updated = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("💥 PUT /api/products/[id] ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: ApiRouteContext) {
  try {
    await connectToDatabase();

    const id = await getRouteId(context);
    const deleted = await Product.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("💥 DELETE /api/products/[id] ERROR:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
