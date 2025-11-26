"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
        return res.status(401).json({ message: "No token provided" });
    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer" || !token)
        return res.status(401).json({ message: "Malformed token" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            role: decoded.role,
            email: decoded.email,
        };
        next();
    }
    catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.authenticate = authenticate;
