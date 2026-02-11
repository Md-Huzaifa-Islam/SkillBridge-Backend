import { Request, Response } from "express";
import { BookingsService } from "./bookings.service";
import { catchAsync } from "../../lib/asyncHandler";
import { AppError } from "../../lib/AppError";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { tutor_id, start_time, end_time, date } = req.body;

  const booking = await BookingsService.createBooking({
    student_id: userId,
    tutor_id,
    start_time,
    end_time,
    date,
  });

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

const getUserBookings = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userRole = (req.user as any)?.role;
  if (!userId) throw new AppError("Unauthorized", 401);

  const query = {
    page: req.query.page as string,
    limit: req.query.limit as string,
    status: req.query.status as string,
  };

  const result = await BookingsService.getUserBookings(userId, userRole, query);

  res.status(200).json({
    success: true,
    message: "Bookings retrieved successfully",
    ...result,
  });
});

const getBookingDetails = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userRole = (req.user as any)?.role;
  const id = req.params.id as string;
  if (!userId) throw new AppError("Unauthorized", 401);
  if (!id) throw new AppError("Booking ID is required", 400);

  const booking = await BookingsService.getBookingDetails(id, userId, userRole);
  if (!booking) throw new AppError("Booking not found", 404);

  res.status(200).json({
    success: true,
    message: "Booking details retrieved successfully",
    data: booking,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userRole = (req.user as any)?.role;
  const id = req.params.id as string;
  const { status } = req.body;
  if (!userId) throw new AppError("Unauthorized", 401);

  const booking = await BookingsService.updateBookingStatus(
    id,
    userId,
    userRole,
    status,
  );

  res.status(200).json({
    success: true,
    message: "Booking status updated successfully",
    data: booking,
  });
});

export const BookingsController = {
  createBooking,
  getUserBookings,
  getBookingDetails,
  updateBookingStatus,
};
