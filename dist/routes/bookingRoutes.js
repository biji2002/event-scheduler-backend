"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/bookings.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const bookingController_1 = require("../controllers/bookingController");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.authenticate, bookingController_1.createBooking);
router.get("/me", authMiddleware_1.authenticate, bookingController_1.getMyBookings);
router.get("/admin", authMiddleware_1.authenticate, bookingController_1.getBookingsForAdmin);
exports.default = router;
