import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma/enums";
import { auth as betterAuth } from "../lib/auth";

export const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession();
      if (!session || !session.user) {
        res.status(401);
        throw new Error("Unauthorized: no session");
      }

      const userRole = session.user.role as UserRole;

      if (!roles.includes(userRole)) {
        res.status(403);
        throw new Error("Forbidden: You can't access this route");
      }

      req.user = session.user;
      next();
    } catch (error: any) {
      next(error);
    }
  };
};
