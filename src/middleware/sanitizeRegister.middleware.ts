import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma/enums";

export const sanitizeRegistration = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Use req.path instead of req.baseUrl
    const haveToCheck =
      req.path === "/api/auth/sign-up/email" && req.method === "POST";

    if (haveToCheck) {
      if (req.body.role && req.body.role === UserRole.admin) {
        return res.status(403).json({ error: "You can't create admin role" });
      }
    }
    next();
  } catch (error: any) {
    next(error);
  }
};
