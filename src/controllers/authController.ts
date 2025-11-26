// backend/src/controllers/authController.ts
import prisma from "../prismaClient";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";
import { Request, Response } from "express";

/**
 * Login - expects { email, password, role }
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // role string coming from request might be "USER"/"ADMIN" or lowercase; normalize
    const requestedRole = typeof role === "string" ? role.toUpperCase() : role;
    if (user.role !== requestedRole) {
      return res.status(401).json({ message: "Incorrect role selected" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Register - expects { email, password, role, name }
 * NOTE: You said you want multiple admins allowed. This register allows any role.
 */
export async function register(req: Request, res: Response) {
  try {
    const { email, password, role = "USER", name } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const normalizedRole = String(role).toUpperCase() === "ADMIN" ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: { email, password: hashed, role: normalizedRole, name },
    });

    return res.status(201).json({
      message: "User registered",
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}
