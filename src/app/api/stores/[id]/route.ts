import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Store from "@/models/Store";
import { ApiRouteContext } from "@/types/ApiParams";
import { getRouteId } from "@/lib/getRouteId";
import { verifyAdminRequest } from "@/lib/apiAuth";

export async function PUT(req: Request, context: ApiRouteContext) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const id = await getRouteId(context);
    console.log("🛠 Updating store with id:", id);

    const body = await req.json();
    console.log("📝 Incoming body:", body);

    const updated = await Store.findByIdAndUpdate(id, body, { new: true }).lean();

    if (!updated) {
      console.log("❌ Store NOT found in DB.");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("✅ Store updated:", updated);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("💥 PUT /stores/:id ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: ApiRouteContext) {
  if (!verifyAdminRequest(_req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const id = await getRouteId(context);
    console.log("🗑 Deleting store id:", id);

    const deleted = await Store.findByIdAndDelete(id).lean();

    if (!deleted) {
      console.log("❌ Store NOT found in DB.");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("✅ Store deleted:", deleted);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("💥 DELETE /stores/:id ERROR:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
