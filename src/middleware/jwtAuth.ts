import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { config } from "../config/config";
const JWT_SECRET = config.jwt_secret;

export const authenticate = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }
      const token = authHeader.split(" ")[1];
      const payload = jwt.verify(token, JWT_SECRET) as any;
      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user || user.status !== "active") {
        return res.status(401).json({ message: "Invalid or banned user" });
      }
      if (roles.length && !roles.includes(user.role as UserRole)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
