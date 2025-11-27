// backend/src/app.ts
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import eventsRoutes from "./routes/events";
import bookingRoutes from "./routes/bookingRoutes";

const app = express();

// Accept CLIENT_ORIGINS as a comma-separated list of allowed origins.
// Example: "https://your-frontend.vercel.app,https://another.vercel.app"
const allowedOrigins = process.env.CLIENT_ORIGINS
  ? process.env.CLIENT_ORIGINS.split(",").map(s => s.trim())
  : [
      "http://localhost:3000",
      // keep any old dev URLs if you want
      "https://event-scheduler-delta.vercel.app",
      "https://event-scheduler-git-master-bijis-projects-08a6abd4.vercel.app"
    ];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like curl, mobile apps, servers)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS policy: Origin not allowed"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);
app.use("/bookings", bookingRoutes);

app.get("/", (_, res) => res.json({ message: "Event Scheduler API running" }));

export default app;
