import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma/enums";

export const sanitizeRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const haveToCheck =
      req.baseUrl === "/api/auth/sign-up/email" && req.method === "POST";
    if (haveToCheck) {
      if (req.body.role && req.body.role === UserRole.admin) {
        res.status(403);
        throw new Error("You can't create admin role");
      }
    }
    next();
  } catch (error: any) {
    next(error);
  }
};
