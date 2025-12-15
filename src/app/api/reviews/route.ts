import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Review } from "@/models/Review";

export async function GET() {
  try {
    await connectToDatabase();
    const reviews = await Review.find().sort({ createdAt: 1 }).lean();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[GET /api/reviews] Error:", error);
    return NextResponse.json(
      { message: "Error fetching reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const review = await Review.create({
      name: body.name,
      message: body.message,
      messageFr: body.messageFr,
      messageNl: body.messageNl,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("[POST /api/reviews] Error:", error);
    return NextResponse.json(
      { message: "Error creating review" },
      { status: 500 }
    );
  }
}
