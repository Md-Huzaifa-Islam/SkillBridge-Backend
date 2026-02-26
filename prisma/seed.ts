import { prisma } from "../src/lib/prisma";
import { UserRole, UserStatus } from "../generated/prisma/enums";
import { hash } from "bcryptjs";
import { randomUUID } from "crypto";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@skillbridge.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (!existing) {
    const passwordHash = await hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        id: randomUUID(),
        name: "Admin",
        email: adminEmail,
        emailVerified: true,
        role: UserRole.admin,
        status: UserStatus.active,
        accounts: {
          create: {
            password: passwordHash,
            providerId: "credentials",
            accountId: adminEmail,
          },
        },
      },
    });
    console.log("Admin user seeded.");
  } else {
    console.log("Admin user already exists.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
