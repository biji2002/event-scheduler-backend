// backend/src/app.ts
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import eventsRoutes from "./routes/events";
import bookingRoutes from "./routes/bookingRoutes";

const app = express();

// 💥 FIXED CORS — allows your Vercel frontend + localhost
app.use(
  cors({
    origin: ["http://localhost:3000", "https://event-scheduler-delta.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);
app.use("/bookings", bookingRoutes);

app.get("/", (_, res) => res.json({ message: "Event Scheduler API running" }));

export default app;
