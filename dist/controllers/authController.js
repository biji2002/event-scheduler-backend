"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
// backend/src/controllers/authController.ts
const prismaClient_1 = __importDefault(require("../prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
async function login(req, res) {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ message: "Missing fields" });
    }
    const user = await prismaClient_1.default.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
    if (user.role !== role)
        return res.status(401).json({ message: "Incorrect role selected" });
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match)
        return res.status(401).json({ message: "Invalid credentials" });
    const token = (0, jwt_1.signToken)({
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
async function register(req, res) {
    const { email, password, role, name } = req.body;
    if (!email || !password || !role)
        return res.status(400).json({ message: "Missing fields" });
    if (role === "ADMIN") {
        const adminExists = await prismaClient_1.default.user.findFirst({ where: { role: "ADMIN" } });
        if (adminExists)
            return res.status(400).json({ message: "Only one admin allowed" });
    }
    const existing = await prismaClient_1.default.user.findUnique({ where: { email } });
    if (existing)
        return res.status(400).json({ message: "Email already registered" });
    const hashed = await bcrypt_1.default.hash(password, 10);
    const user = await prismaClient_1.default.user.create({
        data: { email, password: hashed, role, name },
    });
    return res.status(201).json({
        message: "User registered",
        user: { id: user.id, email: user.email, role: user.role },
    });
}
