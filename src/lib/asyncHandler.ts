import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "./AppError";

export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const validate =
  (schema: z.ZodType<any>, source: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req[source]);
      if (!result.success) {
        const errors = result.error.issues.map(
          (issue: any) => `${issue.path.join(".")}: ${issue.message}`,
        );
        throw new AppError(errors.join(", "), 400);
      }
      (req as any)[source] = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
