// backend/src/app.ts
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import eventRoutes from "./routes/events";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
   
  })
);

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Event Scheduler API running" });
});

export default app;
