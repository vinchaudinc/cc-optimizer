import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data, timestamp = new Date().toISOString() } = body;

    if (!event) {
      return NextResponse.json(
        { error: "Missing event name" },
        { status: 400 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Log to console for Vercel function logs
    console.log("Analytics Event:", { event, data, timestamp, ip });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics logging error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
