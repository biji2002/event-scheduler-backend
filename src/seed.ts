// backend/src/seed.ts
import prisma from "./prismaClient";
import bcrypt from "bcrypt";

async function main() {
  const password = await bcrypt.hash("admin123", 10);
  const exists = await prisma.user.findUnique({ where: { email: "admin@example.com" } });
  if (!exists) {
    await prisma.user.create({
      data: { email: "admin@example.com", password, role: "ADMIN", name: "Admin User" },
    });
    console.log("Admin created: admin@example.com / admin123");
  } else {
    console.log("Admin already exists");
  }
}

main().catch(console.error).finally(() => process.exit(0));
