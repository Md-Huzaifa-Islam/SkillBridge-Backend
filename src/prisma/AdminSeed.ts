import { prisma } from "../lib/prisma.js";
import { auth } from "../lib/auth.js";

async function seedAdmin() {
  const adminEmail = "admin@skillbridge.com";
  const adminPassword = "admin123";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const result = await auth.api.signUpEmail({
    body: {
      email: adminEmail,
      password: adminPassword,
      name: "Admin User",
    },
  });

  if (!result || !result.user) {
    console.log("Failed to create admin");
    return;
  }

  await prisma.user.update({
    where: { email: adminEmail },
    data: {
      emailVerified: true,
      role: "admin",
    },
  });

  console.log("Admin created successfully");
}

seedAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
