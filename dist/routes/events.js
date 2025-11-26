"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// PUBLIC
// Users MUST be logged in, but ANY role can view events
router.get("/", authMiddleware_1.authenticate, eventController_1.getEvents);
// ADMIN ONLY
router.post("/", authMiddleware_1.authenticate, eventController_1.createEvent);
router.put("/:id", authMiddleware_1.authenticate, eventController_1.updateEvent);
router.delete("/:id", authMiddleware_1.authenticate, eventController_1.deleteEvent);
exports.default = router;
