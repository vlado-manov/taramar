import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { ApiRouteContext } from "@/types/ApiParams";
import { getRouteId } from "@/lib/getRouteId";

export async function PUT(req: Request, context: ApiRouteContext) {
  try {
    await connectToDatabase();

    const id = await getRouteId(context);
    console.log("🛠 Updating product with id:", id);

    const body = await req.json();
    console.log("📝 Incoming body:", body);

    const updated = await Product.findByIdAndUpdate(id, body, { new: true }).lean();

    if (!updated) {
      console.log("❌ Product NOT found in DB.");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("✅ Product updated:", updated);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("💥 PUT /products/:id ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: ApiRouteContext) {
  try {
    await connectToDatabase();

    const id = await getRouteId(context);
    console.log("🗑 Deleting product id:", id);

    const deleted = await Product.findByIdAndDelete(id).lean();

    if (!deleted) {
      console.log("❌ Product NOT found in DB.");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("✅ Product deleted:", deleted);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("💥 DELETE /products/:id ERROR:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
