import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as HeadersInit,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No valid session found",
        });
      }

      if (!session.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not found",
        });
      }

      // Block banned users from accessing any protected resource
      if (session.user.is_banned) {
        return res.status(403).json({
          success: false,
          message: "Your account has been suspended",
        });
      }

      if (!session.user.role || !roles.includes(session.user.role)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden: You do not have permission to access this resource",
        });
      }

      req.user = session.user;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }
  };
};
