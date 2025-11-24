// backend/src/server.ts
import app from "./app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Database connection function
async function connectDB() {
  try {
    await prisma.$connect();
    console.log(" Connected to PostgreSQL database");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
}

startServer();
