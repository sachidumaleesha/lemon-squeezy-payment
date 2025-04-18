"server only";
import { db } from "@/lib/db";
import { lemonSqueezyApiInstance } from "./config";

export async function createLemonSqueezyCustomer(userData: {
  userId: string;
  name: string;
  email: string;
  city?: string;
  region?: string;
  country?: string;
}) {
  try {
    const { userId, name, email, city, region, country } = userData;

    // First, check if a customer with this email already exists
    const existingCustomer = await getLemonSqueezyCustomerByEmail(email);

    let lemonSqueezyCustomer;

    if (existingCustomer) {
      console.log(
        `Customer with email ${email} already exists with ID: ${existingCustomer.id}`
      );
      lemonSqueezyCustomer = existingCustomer;
    } else {
      // Create new customer in Lemon Squeezy only if one doesn't exist
      const response = await lemonSqueezyApiInstance.post("/customers", {
        data: {
          type: "customers",
          attributes: {
            name,
            email,
            city,
            region,
            country,
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: process.env.LEMONSQUEEZY_STORE_ID,
              },
            },
          },
        },
      });

      lemonSqueezyCustomer = response.data.data;
      console.log(
        `Created new Lemon Squeezy customer with ID: ${lemonSqueezyCustomer.id}`
      );
    }

    // Update user in database with Lemon Squeezy customer ID
    if (userId) {
      await db.user.update({
        where: { id: userId },
        data: {
          lemonSqueezyCustomerId: lemonSqueezyCustomer.id,
        },
      });
    }

    return lemonSqueezyCustomer;
  } catch (error: any) {
    console.error(
      "Lemon Squeezy customer operation error:",
      error.response?.data || error
    );
    throw error;
  }
}

export async function getLemonSqueezyCustomerByEmail(email: string) {
  try {
    // Get customers from Lemon Squeezy and filter by email
    const response = await lemonSqueezyApiInstance.get(
      `/customers?filter[email]=${encodeURIComponent(email)}`
    );

    const customers = response.data.data;

    if (customers.length === 0) {
      return null;
    }

    return customers[0];
  } catch (error: any) {
    console.error(
      "Lemon Squeezy customer fetch error:",
      error.response?.data || error
    );
    throw error;
  }
}
