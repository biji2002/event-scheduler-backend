// backend/src/routes/bookings.ts
import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { createBooking, getMyBookings, getBookingsForAdmin } from "../controllers/bookingController";

const router = Router();

router.post("/", authenticate, createBooking);
router.get("/me", authenticate, getMyBookings);
router.get("/admin", authenticate, getBookingsForAdmin);

export default router;
