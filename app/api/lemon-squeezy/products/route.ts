import { getAllProducts } from "@/lib/lemon-squeezy/product-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const lemonSqueezyProducts = await getAllProducts();
    return NextResponse.json(lemonSqueezyProducts, { status: 201 });
  } catch (error: any) {
    console.error("API error fetching Lemon Squeezy products:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Lemon Squeezy products",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
