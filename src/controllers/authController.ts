// backend/src/controllers/authController.ts
import prisma from "../prismaClient";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";
import { Request, Response } from "express";

export async function login(req, res) {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  if (user.role !== role) return res.status(401).json({ message: "Incorrect role selected" });

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
    },
  });
}

export async function register(req, res) {
  const { email, password, role, name } = req.body;
  if (!email || !password || !role) return res.status(400).json({ message: "Missing fields" });

  if (role === "ADMIN") {
    const adminExists = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (adminExists) return res.status(400).json({ message: "Only one admin allowed" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, role, name },
  });

  return res.status(201).json({
    message: "User registered",
    user: { id: user.id, email: user.email, role: user.role },
  });
}
