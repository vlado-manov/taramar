import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Review } from "@/models/Review";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, { params }: Context) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id } = await params;

    const updated = await Review.findByIdAndUpdate(
      id,
      {
        ...(body.name != null ? { name: body.name } : {}),
        ...(body.message != null ? { message: body.message } : {}),
        ...(body.messageFr != null ? { messageFr: body.messageFr } : {}),
        ...(body.messageNl != null ? { messageNl: body.messageNl } : {}),
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /api/reviews/:id] Error:", error);
    return NextResponse.json(
      { message: "Error updating review" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: Context) {
  try {
    await connectToDatabase();
    const { id } = await params;

    await Review.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/reviews/:id] Error:", error);
    return NextResponse.json(
      { message: "Error deleting review" },
      { status: 500 }
    );
  }
}
