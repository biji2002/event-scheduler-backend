"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = createBooking;
exports.getMyBookings = getMyBookings;
exports.getBookingsForAdmin = getBookingsForAdmin;
const prismaClient_1 = __importDefault(require("../prismaClient"));
/* Create booking (USER only) */
async function createBooking(req, res) {
    try {
        const userId = req.user?.id;
        const { eventId } = req.body;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!eventId)
            return res.status(400).json({ message: "eventId is required" });
        const event = await prismaClient_1.default.event.findUnique({ where: { id: eventId } });
        if (!event)
            return res.status(404).json({ message: "Event not found" });
        const already = await prismaClient_1.default.booking.findFirst({ where: { userId, eventId } });
        if (already)
            return res.status(400).json({ message: "Already booked" });
        const booking = await prismaClient_1.default.booking.create({
            data: {
                userId,
                eventId,
            },
        });
        return res.status(201).json({ message: "Booked", booking });
    }
    catch (error) {
        console.error("BOOKING ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
}
/* Get my bookings */
async function getMyBookings(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const bookings = await prismaClient_1.default.booking.findMany({
            where: { userId },
            include: { event: true },
        });
        res.json(bookings);
    }
    catch (error) {
        console.error("GET BOOKINGS ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
}
/* Admin: get bookings for events they created */
async function getBookingsForAdmin(req, res) {
    try {
        const adminId = req.user?.id;
        if (!adminId)
            return res.status(401).json({ message: "Unauthorized" });
        if (req.user?.role !== "ADMIN")
            return res.status(403).json({ message: "Admins only" });
        const bookings = await prismaClient_1.default.booking.findMany({
            where: {
                event: { createdBy: adminId },
            },
            include: { user: true, event: true },
        });
        res.json(bookings);
    }
    catch (error) {
        console.error("ADMIN BOOKINGS ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
}
