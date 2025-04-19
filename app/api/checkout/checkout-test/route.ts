import { type NextRequest, NextResponse } from "next/server";
import { lemonSqueezyApiInstance } from "@/lib/lemonsqueezy";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    // Validate environment variables
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!variantId || !storeId || !appUrl) {
      return new NextResponse("Missing environment variables", { status: 500 });
    }

    // Add custom data gradually - make sure all values are strings if needed
    const customData = {
      productId: String(productId),
      testMode: "true", // Convert boolean to string
      timestamp: new Date().toISOString(),
    };

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
            custom: customData,
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

    console.log("Sending request:", JSON.stringify(checkoutData, null, 2));

    const response = await lemonSqueezyApiInstance.post(
      "/checkouts",
      checkoutData
    );
    const checkoutUrl = response.data.data.attributes.url;
    return NextResponse.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return new NextResponse(
      `Error: ${JSON.stringify(error.response?.data || error.message)}`,
      {
        status: error.response?.status || 500,
      }
    );
  }
}
