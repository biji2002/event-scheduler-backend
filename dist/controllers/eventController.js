"use strict";
// backend/src/controllers/eventController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEvents = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
/* ============================================================
   GET ALL EVENTS  (ANY LOGGED-IN USER)
   ============================================================ */
const getEvents = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const events = await prismaClient_1.default.event.findMany({
            include: {
                admin: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                bookings: true,
            },
            orderBy: { date: "asc" },
        });
        // frontend expects "organizer", not "admin"
        const formatted = events.map((ev) => ({
            ...ev,
            organizer: ev.admin,
        }));
        return res.status(200).json(formatted);
    }
    catch (err) {
        console.error("Get events error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getEvents = getEvents;
/* ============================================================
   CREATE EVENT  (ADMIN ONLY)
   ============================================================ */
const createEvent = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res
                .status(403)
                .json({ message: "Only admins can create events" });
        }
        const { title, description, date, location, startTime, endTime } = req.body;
        const event = await prismaClient_1.default.event.create({
            data: {
                title,
                description,
                location,
                createdBy: req.user.id,
                date: new Date(date),
                startTime: startTime ? new Date(startTime) : null,
                endTime: endTime ? new Date(endTime) : null,
            },
            include: {
                admin: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        return res.status(201).json({
            ...event,
            organizer: event.admin,
        });
    }
    catch (err) {
        console.error("Create event error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.createEvent = createEvent;
/* ============================================================
   UPDATE EVENT (ADMIN ONLY)
   ============================================================ */
const updateEvent = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res
                .status(403)
                .json({ message: "Only admins can update events" });
        }
        const id = req.params.id;
        const { title, description, date, location, startTime, endTime } = req.body;
        const updated = await prismaClient_1.default.event.update({
            where: { id },
            data: {
                title,
                description,
                location,
                date: date ? new Date(date) : undefined,
                startTime: startTime ? new Date(startTime) : undefined,
                endTime: endTime ? new Date(endTime) : undefined,
            },
            include: {
                admin: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        return res.json({
            ...updated,
            organizer: updated.admin,
        });
    }
    catch (err) {
        console.error("Update event error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateEvent = updateEvent;
/* ============================================================
   DELETE EVENT (ADMIN ONLY)
   ============================================================ */
const deleteEvent = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res
                .status(403)
                .json({ message: "Only admins can delete events" });
        }
        const id = req.params.id;
        await prismaClient_1.default.event.delete({
            where: { id },
        });
        return res.json({ message: "Event deleted successfully" });
    }
    catch (err) {
        console.error("Delete event error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.deleteEvent = deleteEvent;
