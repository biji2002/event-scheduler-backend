// backend/src/controllers/eventController.ts
import { Response } from "express";
import prisma from "../prismaClient";
import { AuthRequest } from "../middleware/authMiddleware";

/* CREATE */
export async function createEvent(req: AuthRequest, res: Response) {
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
    const overlapping = await prisma.event.findFirst({
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
    const event = await prisma.event.create({
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
  } catch (error) {
    console.error("EVENT CREATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

/* GET */
export async function getEvents(req: AuthRequest, res: Response) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
    res.json(events);
  } catch (error) {
    console.error("EVENT LIST ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

/* UPDATE */
export async function updateEvent(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, date, startMinute, endMinute } = req.body;

    const updated = await prisma.event.update({
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
  } catch (error) {
    console.error("EVENT UPDATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

/* DELETE */
export async function deleteEvent(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id } });
    res.json({ message: "Event deleted" });
  } catch (error) {
    console.error("EVENT DELETE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}
