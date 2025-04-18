import { lemonSqueezyApiInstance } from "@/lib/lemon-squeezy/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productId, variantId } = await req.json();

    // Validate environment variables
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;

    // TODO: ADD Authorization

    if (!storeId || !appUrl) {
      return new NextResponse("Missing environment variables", { status: 500 });
    }

    // Create checkout data
    const checkoutData = {
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            name: "Test Product",
            description: "Test Description",
            redirect_url: `${appUrl}/success`,
          },
          checkout_data: {
            custom: {
              productId,
              variantId,
            },
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: String(storeId),
            },
          },
          variant: {
            data: {
              type: "variants",
              id: String(variantId),
            },
          },
        },
      },
    };

    // Create checkout
    const response = await lemonSqueezyApiInstance.post(
      "/checkouts",
      checkoutData
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.log(error);
  }
}
