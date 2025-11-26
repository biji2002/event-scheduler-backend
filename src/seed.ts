// backend/src/seed.ts
import prisma from "./prismaClient";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

async function main() {
  // create admin user if not exists
  const adminEmail = "seedadmin@example.com";
  let admin = await prisma.user.findUnique({ where: { email: adminEmail }});
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Seed Admin",
        password: await bcrypt.hash("password123", 10),
        role: "ADMIN"
      }
    });
    console.log("Created admin:", admin.id);
  } else {
    console.log("Admin already exists:", admin.id);
  }

  // create one event
  const eventTitle = "Seeded Demo Event";
  const existing = await prisma.event.findFirst({ where: { title: eventTitle }});

  if (!existing) {
    const e = await prisma.event.create({
      data: {
        title: eventTitle,
        description: "This is a seeded event for testing.",
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        location: "Seed Hall",
        createdBy: admin.id,
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + (10*60*60*1000)), // tomorrow 10:00
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + (12*60*60*1000)),
      }
    });
    console.log("Created event:", e.id);
  } else {
    console.log("Event already exists:", existing.id);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
