"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/events.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const eventController_1 = require("../controllers/eventController");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.authenticate, eventController_1.getEvents);
router.post("/", authMiddleware_1.authenticate, eventController_1.createEvent);
router.put("/:id", authMiddleware_1.authenticate, eventController_1.updateEvent);
router.delete("/:id", authMiddleware_1.authenticate, eventController_1.deleteEvent);
exports.default = router;
