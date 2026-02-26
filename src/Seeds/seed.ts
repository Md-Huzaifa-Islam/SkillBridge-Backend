import { config } from "../config/config";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";

async function main() {
  const adminEmail = config.admin_email;
  const adminPassword = config.admin_password;
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
        password: passwordHash,
        emailVerified: true,
        role: UserRole.admin,
        status: UserStatus.active,
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
