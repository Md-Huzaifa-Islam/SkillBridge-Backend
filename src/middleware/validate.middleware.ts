import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape } from "zod";

export const validate =
  (schema: ZodObject<ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }
  };
