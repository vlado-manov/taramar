// src/app/api/geocode/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing q param" }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", `${query}, Belgium`);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "belgium-stores-app/1.0" },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
  }

  const data = await res.json();

  if (!data.length) {
    return NextResponse.json({ error: "No results" }, { status: 404 });
  }

  const { lat, lon } = data[0];
  return NextResponse.json({ lat: parseFloat(lat), lng: parseFloat(lon) });
}
