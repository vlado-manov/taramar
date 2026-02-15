import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Subscriber } from "@/models/Subscriber";
import { verifyAdminRequest } from "@/lib/apiAuth";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(req: NextRequest, { params }: Context) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { id } = await params;
    await Subscriber.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
