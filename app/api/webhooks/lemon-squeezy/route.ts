import crypto from "crypto";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get the raw request body for signature verification
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    // Get the event type and signature
    const eventType = req.headers.get("X-Event-Name");
    const signature = req.headers.get("X-Signature");

    if (!signature) {
      return Response.json({ message: "Missing signature" }, { status: 400 });
    }

    // Verify the signature (important for production)
    const secret = process.env.LEMONSQUEEZY_SIGNING_SECRET;
    if (!secret) {
      console.error("Missing LEMONSQUEEZY_SIGNING_SECRET");
      return Response.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(rawBody).digest("hex");

    // For testing, we'll log both values to help debug
    console.log("Calculated signature:", digest);
    console.log("Received signature:", signature);

    // In production, use crypto.timingSafeEqual for comparison
    if (digest !== signature) {
      console.log("Invalid signature");
      return Response.json({ message: "Invalid signature" }, { status: 401 });
    }

    console.log(`Webhook received: ${eventType}`);

    // Handle different event types
    switch (eventType) {
      case "order_created":
        const customData = body.meta.custom_data;
        console.log("Order created with custom data:", customData);

        // In a real app, you'd store this in a database
        // For testing, we just log it
        console.log("Test purchase successful!");
        break;

      case "order_refunded":
        console.log("Order refunded:", body.data.id);
        break;

      case "subscription_created":
        console.log("Subscription created:", body.data.id);
        break;

      default:
        console.log("Unhandled event type:", eventType);
    }

    return Response.json({
      message: "Webhook processed successfully",
      event: eventType,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}