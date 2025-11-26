// src/types/AuthRequest.ts
import { Request } from "express";

export interface UserPayload {
  id: string;
  role: "USER" | "ADMIN";
}

export interface AuthRequest extends Request {
  user?: UserPayload; 
}
