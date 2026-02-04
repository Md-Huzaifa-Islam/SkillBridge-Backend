import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get the session from the request using betterAuth
      const session = await betterAuth.api.getSession({
        headers: req.headers as HeadersInit,
      });

      // Check if session exists
      if (!session) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No valid session found" });
      }

      // Check if user exists in the session
      if (!session.user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }

      if (!session.user.role) {
        return res.status(403).json({
          message:
            "Forbidden: You do not have permission to access this resource",
        });
      }
      if (!roles.includes(session.user.role)) {
        return res.status(403).json({
          message:
            "Forbidden: You do not have permission to access this resource",
        });
      }

      // Attach user to request object for use in route handlers
      req.user = session.user;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Authentication failed" });
    }
  };
};
