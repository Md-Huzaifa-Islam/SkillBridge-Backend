import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../lib/AppError";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors: string[] | undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = err.issues.map(
      (issue: any) => `${issue.path.join(".")}: ${issue.message}`,
    );
  }

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err.code === "P2002") {
    statusCode = 409;
    const target = err.meta?.target;
    message = `Duplicate value for ${Array.isArray(target) ? target.join(", ") : target || "field"}`;
  }

  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }

  if (err.code === "P2003") {
    statusCode = 400;
    message = "Invalid reference: related record not found";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
