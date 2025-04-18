import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { db } from "@/lib/db";
import { createLemonSqueezyCustomer } from "@/lib/lemon-squeezy/customer-service";

export async function POST(req: NextRequest) {
  const client = await clerkClient();

  try {
    const evt = await verifyWebhook(req);
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    // console.log("Webhook payload:", evt.data);

    if (eventType === "user.created") {
      const {
        id,
        first_name,
        last_name,
        username,
        email_addresses,
        image_url,
      } = evt.data;

      try {
        const res = await client.users.updateUserMetadata(id as string, {
          publicMetadata: { role: "USER" },
        });
        const newUser = await db.user.create({
          data: {
            clerkId: id,
            firstName: first_name,
            lastName: last_name,
            username: username,
            email: email_addresses[0].email_address,
            imageUrl: image_url,
          },
        });

        // Create customer in Lemon Squeezy
        try {
          const fullName = `${first_name || ""} ${last_name || ""}`.trim();
          const lemonSqueezyCustomer = await createLemonSqueezyCustomer({
            userId: newUser.id,
            name: fullName || username || "Customer",
            email: email_addresses[0].email_address,
          });

          console.log(
            `Created Lemon Squeezy customer with ID: ${lemonSqueezyCustomer.id}`
          );
        } catch (lemonError) {
          console.error("Failed to create Lemon Squeezy customer:", lemonError);
          // Continue execution - don't fail the whole webhook if just Lemon Squeezy fails
        }

        return new Response(JSON.stringify(newUser), {
          status: 201,
        });
      } catch (error) {
        console.log("clerk user created error: ", error);
        return new Response(
          "Error: Failed to create clerk new user in the database",
          {
            status: 500,
          }
        );
      }
    }

    if (eventType === "user.updated") {
      const {
        id,
        first_name,
        last_name,
        username,
        email_addresses,
        image_url,
      } = evt.data;

      try {
        const updateUser = await db.user.update({
          where: {
            clerkId: id,
          },
          data: {
            clerkId: id,
            firstName: first_name,
            lastName: last_name,
            username: username,
            email: email_addresses[0].email_address,
            imageUrl: image_url,
          },
        });
        return new Response(JSON.stringify(updateUser), {
          status: 201,
        });
      } catch (error) {
        console.log("clerk user update error: ", error);
        return new Response(
          "Error: Failed to update clerk user in the database",
          {
            status: 500,
          }
        );
      }
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;
      try {
        const deleteUser = await db.user.delete({
          where: {
            clerkId: id,
          },
        });
        return new Response(JSON.stringify(deleteUser), {
          status: 201,
        });
      } catch (error) {
        console.log("clerk user delete error: ", error);
        return new Response(
          "Error: Failed to delete clerk user in the database",
          {
            status: 500,
          }
        );
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
