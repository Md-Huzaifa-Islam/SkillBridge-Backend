import { prisma } from "../lib/prisma.js";
import { randomUUID } from "crypto";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categories = [
    { id: randomUUID(), name: "Mathematics" },
    { id: randomUUID(), name: "Physics" },
    { id: randomUUID(), name: "Chemistry" },
    { id: randomUUID(), name: "Biology" },
    { id: randomUUID(), name: "Computer Science" },
    { id: randomUUID(), name: "English" },
    { id: randomUUID(), name: "History" },
    { id: randomUUID(), name: "Geography" },
  ];

  console.log("Creating categories...");
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }
  console.log("✅ Categories created");

  // Create admin user
  console.log("Creating admin user...");
  const adminId = randomUUID();
  await prisma.user.upsert({
    where: { email: "admin@skillbridge.com" },
    update: {},
    create: {
      id: adminId,
      name: "Admin User",
      email: "admin@skillbridge.com",
      emailVerified: true,
      role: "admin",
      accounts: {
        create: {
          id: randomUUID(),
          accountId: adminId,
          providerId: "credential",
          password:
            "$2a$10$rKJ9JZ2KZqY8vQ9XqH9L0.1Y5Z3Z4Z5Z6Z7Z8Z9Z0Z1Z2Z3Z4Z5Z6", // password: admin123
        },
      },
    },
  });
  console.log("✅ Admin user created (email: admin@skillbridge.com, password: admin123)");

  console.log("🎉 Seeding completed!");
}

seed()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
