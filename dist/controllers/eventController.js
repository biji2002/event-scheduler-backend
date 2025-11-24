"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = createEvent;
exports.getEvents = getEvents;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
const prismaClient_1 = __importDefault(require("../prismaClient"));
/* CREATE */
async function createEvent(req, res) {
    try {
        const { title, description, date, startMinute, endMinute } = req.body;
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!title || !date || startMinute == null || endMinute == null) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // ❌ End time must be after start time
        if (endMinute <= startMinute) {
            return res.status(400).json({
                message: "End time must be later than start time",
            });
        }
        // Normalize date (remove time)
        const eventDay = new Date(date);
        eventDay.setHours(0, 0, 0, 0);
        //  Cannot create event in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (eventDay < today) {
            return res.status(400).json({
                message: "Cannot create events in the past",
            });
        }
        //  Check time collision
        const overlapping = await prismaClient_1.default.event.findFirst({
            where: {
                date: eventDay,
                AND: [
                    { startMinute: { lt: endMinute } },
                    { endMinute: { gt: startMinute } },
                ],
            },
        });
        if (overlapping) {
            return res.status(409).json({
                message: "Another event already exists during this time",
            });
        }
        // Create event
        const event = await prismaClient_1.default.event.create({
            data: {
                title,
                description,
                date: eventDay,
                startMinute,
                endMinute,
                createdById: req.user.id,
            },
        });
        res.status(201).json(event);
    }
    catch (error) {
        console.error("EVENT CREATE ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
}
/* GET */
async function getEvents(req, res) {
    try {
        const events = await prismaClient_1.default.event.findMany({
            orderBy: { date: "asc" },
        });
        res.json(events);
    }
    catch (error) {
        console.error("EVENT LIST ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
}
/* UPDATE */
async function updateEvent(req, res) {
    try {
        const { id } = req.params;
        const { title, description, date, startMinute, endMinute } = req.body;
        const updated = await prismaClient_1.default.event.update({
            where: { id },
            data: {
                title,
                description,
                date: new Date(date),
                startMinute,
                endMinute,
            },
        });
        res.json(updated);
    }
    catch (error) {
        console.error("EVENT UPDATE ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
}
/* DELETE */
async function deleteEvent(req, res) {
    try {
        const { id } = req.params;
        await prismaClient_1.default.event.delete({ where: { id } });
        res.json({ message: "Event deleted" });
    }
    catch (error) {
        console.error("EVENT DELETE ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
}
