import { Router } from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController";

import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// PUBLIC
// Users MUST be logged in, but ANY role can view events
router.get("/", authenticate, getEvents);


// ADMIN ONLY
router.post("/", authenticate, createEvent);
router.put("/:id", authenticate, updateEvent);
router.delete("/:id", authenticate, deleteEvent);

export default router;
