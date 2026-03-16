import { NextResponse } from "next/server";

import { getCardById } from "@/app/lib/creditCards";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cardId = searchParams.get("cardId");

  if (!cardId) {
    return NextResponse.json({ error: "Missing cardId" }, { status: 400 });
  }

  const card = getCardById(cardId);

  if (!card) {
    return NextResponse.json({ error: "Unknown cardId" }, { status: 404 });
  }

  console.log(
    JSON.stringify({
      event: "apply_click",
      clickedAt: new Date().toISOString(),
      cardId: card.id,
      cardName: card.name,
      issuer: card.issuer,
      destinationUrl: card.applyUrl,
      userAgent: req.headers.get("user-agent"),
      referer: req.headers.get("referer"),
      xForwardedFor: req.headers.get("x-forwarded-for"),
    })
  );

  return NextResponse.redirect(card.applyUrl, 307);
}
