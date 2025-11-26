// backend/src/controllers/bookingController.ts
import { Response } from "express";
import prisma from "../prismaClient";
import { AuthRequest } from "../middleware/authMiddleware";

/* Create booking (USER only) */
export async function createBooking(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { eventId } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!eventId) return res.status(400).json({ message: "eventId is required" });

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const already = await prisma.booking.findFirst({ where: { userId, eventId } });
    if (already) return res.status(400).json({ message: "Already booked" });

    const booking = await prisma.booking.create({
      data: {
        userId,
        eventId,
      },
    });

    return res.status(201).json({ message: "Booked", booking });
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

/* Get my bookings */
export async function getMyBookings(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { event: true },
    });

    res.json(bookings);
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

/* Admin: get bookings for events they created */
export async function getBookingsForAdmin(req: AuthRequest, res: Response) {
  try {
    const adminId = req.user?.id;
    if (!adminId) return res.status(401).json({ message: "Unauthorized" });
    if (req.user?.role !== "ADMIN") return res.status(403).json({ message: "Admins only" });

    const bookings = await prisma.booking.findMany({
      where: {
        event: { createdBy: adminId },
      },
      include: { user: true, event: true },
    });

    res.json(bookings);
  } catch (error) {
    console.error("ADMIN BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}
