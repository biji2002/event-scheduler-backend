// backend/src/controllers/eventController.ts

import { Response } from "express";
import prisma from "../prismaClient";
import { AuthRequest } from "../middleware/authMiddleware";

/* ============================================================
   GET ALL EVENTS  (ANY LOGGED-IN USER)
   ============================================================ */
export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const events = await prisma.event.findMany({
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
  } catch (err) {
    console.error("Get events error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   CREATE EVENT  (ADMIN ONLY)
   ============================================================ */
export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Only admins can create events" });
    }

    const { title, description, date, location, startTime, endTime } = req.body;

    const event = await prisma.event.create({
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
  } catch (err) {
    console.error("Create event error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   UPDATE EVENT (ADMIN ONLY)
   ============================================================ */
export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Only admins can update events" });
    }

    const id = req.params.id;
    const { title, description, date, location, startTime, endTime } = req.body;

    const updated = await prisma.event.update({
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
  } catch (err) {
    console.error("Update event error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   DELETE EVENT (ADMIN ONLY)
   ============================================================ */
export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Only admins can delete events" });
    }

    const id = req.params.id;

    await prisma.event.delete({
      where: { id },
    });

    return res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete event error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
