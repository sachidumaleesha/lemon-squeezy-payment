import { PrismaClient } from "./app/generated/prisma";
import { db } from "./lib/db";

async function main() {
  const prisma = new PrismaClient();

  await prisma.plan.createMany({
    data: [
      {
        name: "Free",
        description: "Free plan",
        price: 0,
        currency: "USD",
        lemonSqueezyProductId: "free",
        lemonSqueezyVariantId: "free",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pro",
        description: "Pro plan",
        price: 10,
        currency: "USD",
        lemonSqueezyProductId: "pro",
        lemonSqueezyVariantId: "pro",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  console.log("Seed data inserted successfully.");
}

main();
