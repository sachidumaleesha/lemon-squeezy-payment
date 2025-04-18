"server only";
import { lemonSqueezyApiInstance } from "./config";

export async function getAllProducts() {
  try {
    // const response = await lemonSqueezyApiInstance.get(
    //   `products?filter[store_id]=${process.env.LEMONSQUEEZY_STORE_ID}`
    // );
    // return response.data.data;

    const products = await lemonSqueezyApiInstance.get(
      `products?filter[store_id]=${process.env.LEMONSQUEEZY_STORE_ID}`
    );
    const productIds = products.data.data.map((product: any) => {
      return { id: product.id, name: product.attributes.name };
    });

    const productVariants = await Promise.all(
      productIds.map((product: any) =>
        lemonSqueezyApiInstance.get(
          `/variants/?filter[product_id]=${product.id}`
        )
      )
    );

    const productsWithVariants = productIds.map((product: any, index: any) => {
      return {
        id: product.id,
        name: product.name,
        variantId: productVariants[index].data.data[0].id,
      };
    });

    return productsWithVariants;
  } catch (error: any) {
    console.error(
      "Lemon Squeezy order fetch error:",
      error.response?.data || error
    );
    throw error;
  }
}
