import { AccessToken, RoomAgentDispatch, RoomConfiguration } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedLang = (searchParams.get("language") || "urdu").toLowerCase();
    const preferredLanguage = requestedLang === "english" ? "english" : "urdu";
    const roomLangCode = preferredLanguage === "english" ? "en" : "ur";
    const roomName = `nora-ev-support-${roomLangCode}-${crypto.randomUUID()}`;
    const participantName = `customer-${Date.now()}`;

    // Create access token
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: participantName,
        name: participantName,
      }
    );

    // Grant permissions
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    // Dispatch agent when participant connects to this unique room
    at.roomConfig = new RoomConfiguration({
      name: roomName,
      emptyTimeout: 30,
      departureTimeout: 1,
      metadata: JSON.stringify({ language: preferredLanguage }),
      agents: [
        new RoomAgentDispatch({
          agentName: "nora-ev-agent",
        }),
      ],
    });

    const token = await at.toJwt();

    return NextResponse.json({
      token,
      url: process.env.NEXT_PUBLIC_LIVEKIT_URL,
      room: roomName,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
