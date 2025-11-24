// backend/src/routes/events.ts
import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { createEvent, getEvents, updateEvent, deleteEvent } from "../controllers/eventController";
const router = Router();

router.get("/", authenticate, getEvents);
router.post("/", authenticate, createEvent);
router.put("/:id", authenticate, updateEvent);
router.delete("/:id", authenticate, deleteEvent);

export default router;
