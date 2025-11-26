// backend/src/utils/jwt.ts
import jwt from "jsonwebtoken";

export function signToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
}
