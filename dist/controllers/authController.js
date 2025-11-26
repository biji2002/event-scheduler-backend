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
/**
 * Login - expects { email, password, role }
 */
async function login(req, res) {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Missing fields" });
        }
        const user = await prismaClient_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });
        // role string coming from request might be "USER"/"ADMIN" or lowercase; normalize
        const requestedRole = typeof role === "string" ? role.toUpperCase() : role;
        if (user.role !== requestedRole) {
            return res.status(401).json({ message: "Incorrect role selected" });
        }
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
                name: user.name,
            },
        });
    }
    catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
}
/**
 * Register - expects { email, password, role, name }
 * NOTE: You said you want multiple admins allowed. This register allows any role.
 */
async function register(req, res) {
    try {
        const { email, password, role = "USER", name } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Missing fields" });
        }
        const existing = await prismaClient_1.default.user.findUnique({ where: { email } });
        if (existing)
            return res.status(400).json({ message: "Email already registered" });
        const hashed = await bcrypt_1.default.hash(password, 10);
        const normalizedRole = String(role).toUpperCase() === "ADMIN" ? "ADMIN" : "USER";
        const user = await prismaClient_1.default.user.create({
            data: { email, password: hashed, role: normalizedRole, name },
        });
        return res.status(201).json({
            message: "User registered",
            user: { id: user.id, email: user.email, role: user.role, name: user.name },
        });
    }
    catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
}
