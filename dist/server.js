"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/server.ts
const app_1 = __importDefault(require("./app"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 4000;
async function connectDB() {
    try {
        await prisma.$connect();
        console.log("Connected to PostgreSQL database");
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}
async function startServer() {
    await connectDB();
    app_1.default.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
startServer();
