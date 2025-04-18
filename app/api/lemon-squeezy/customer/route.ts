import { NextRequest, NextResponse } from "next/server";
import {
  createLemonSqueezyCustomer,
  getLemonSqueezyCustomerByEmail,
} from "@/lib/lemon-squeezy/customer-service";

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();
    const lemonSqueezyCustomer = await createLemonSqueezyCustomer(userData);
    return NextResponse.json(lemonSqueezyCustomer, { status: 201 });
  } catch (error: any) {
    console.error("API error creating Lemon Squeezy customer:", error);
    return NextResponse.json(
      {
        error: "Failed to create Lemon Squeezy customer",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const customer = await getLemonSqueezyCustomerByEmail(email);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error("API error fetching Lemon Squeezy customer:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Lemon Squeezy customer",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
