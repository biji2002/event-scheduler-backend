"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/seed.ts
const prismaClient_1 = __importDefault(require("./prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function main() {
    const password = await bcrypt_1.default.hash("admin123", 10);
    const exists = await prismaClient_1.default.user.findUnique({ where: { email: "admin@example.com" } });
    if (!exists) {
        await prismaClient_1.default.user.create({
            data: { email: "admin@example.com", password, role: "ADMIN", name: "Admin User" },
        });
        console.log("Admin created: admin@example.com / admin123");
    }
    else {
        console.log("Admin already exists");
    }
}
main().catch(console.error).finally(() => process.exit(0));
