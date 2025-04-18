import { NextResponse } from "next/server";
import { lemonSqueezyApiInstance } from "@/lib/lemon-squeezy/config";

export async function GET() {
  try {
    // Test the API connection by fetching store information
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;

    if (!storeId) {
      return NextResponse.json(
        { error: "Missing LEMONSQUEEZY_STORE_ID" },
        { status: 500 }
      );
    }

    const response = await lemonSqueezyApiInstance.get(`/stores/${storeId}`);

    return NextResponse.json({
      message: "API connection successful",
      store: response.data,
      environment: {
        storeId: process.env.LEMONSQUEEZY_STORE_ID,
        variantId: process.env.LEMONSQUEEZY_VARIANT_ID,
        hasApiKey: !!process.env.LEMONSQUEEZY_API_KEY,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "API connection failed",
        details: error.response?.data || error.message,
        environment: {
          storeId: process.env.LEMONSQUEEZY_STORE_ID,
          variantId: process.env.LEMONSQUEEZY_VARIANT_ID,
          hasApiKey: !!process.env.LEMONSQUEEZY_API_KEY,
          appUrl: process.env.NEXT_PUBLIC_APP_URL,
        },
      },
      { status: 500 }
    );
  }
}
