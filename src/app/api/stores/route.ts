// src/app/api/stores/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Store from "@/models/Store";

export async function GET() {
  try {
    await connectToDatabase();
    const stores = await Store.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(stores);
  } catch (error) {
    console.error("[GET /api/stores] Error:", error);
    return NextResponse.json(
      { message: "Error fetching stores" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const store = await Store.create({
      name: body.name,
      address: body.address,
      postalCode: body.postalCode,
      city: body.city,
      lat: body.lat,
      lng: body.lng,
      visible: body.visible ?? true,
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error("[POST /api/stores] Error:", error);
    return NextResponse.json(
      { message: "Error creating store" },
      { status: 500 }
    );
  }
}
