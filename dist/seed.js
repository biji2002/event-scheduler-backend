"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/seed.ts
const prismaClient_1 = __importDefault(require("./prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function main() {
    // create admin user if not exists
    const adminEmail = "seedadmin@example.com";
    let admin = await prismaClient_1.default.user.findUnique({ where: { email: adminEmail } });
    if (!admin) {
        admin = await prismaClient_1.default.user.create({
            data: {
                email: adminEmail,
                name: "Seed Admin",
                password: await bcrypt_1.default.hash("password123", 10),
                role: "ADMIN"
            }
        });
        console.log("Created admin:", admin.id);
    }
    else {
        console.log("Admin already exists:", admin.id);
    }
    // create one event
    const eventTitle = "Seeded Demo Event";
    const existing = await prismaClient_1.default.event.findFirst({ where: { title: eventTitle } });
    if (!existing) {
        const e = await prismaClient_1.default.event.create({
            data: {
                title: eventTitle,
                description: "This is a seeded event for testing.",
                date: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
                location: "Seed Hall",
                createdBy: admin.id,
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + (10 * 60 * 60 * 1000)), // tomorrow 10:00
                endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + (12 * 60 * 60 * 1000)),
            }
        });
        console.log("Created event:", e.id);
    }
    else {
        console.log("Event already exists:", existing.id);
    }
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prismaClient_1.default.$disconnect();
});
