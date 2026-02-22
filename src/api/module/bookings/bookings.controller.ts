import { NextFunction, Request, Response } from "express";

const createBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (true) {
      res.status(200);
      throw new Error("This is template");
    }
  } catch (error: any) {
    next(error);
  }
};

export const BookingsControllers = {
  createBookings,
};
