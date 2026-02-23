import { NextFunction, Request, Response } from "express";
import { BookingsServices } from "./bookings.service";
import { BookingStatus, UserRole } from "../../../../generated/prisma/enums";
import { sendResponse } from "../../../middleware/response.middleware";
import { frontendTimeToBackendTime } from "../../../handlers/dateConvertHandler";

const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.user?.id;
    if (!id) {
      res.status(400);
      throw new Error("User id is required.");
    }
    if (req.user?.role == UserRole.tutor) {
      const result = await BookingsServices.getAllBookingsTutor(id);
      sendResponse(res, {
        message: "Bookings of tutor fetched.",
        data: result,
      });
    } else if (req.user?.role == UserRole.student) {
      const result = await BookingsServices.getAllBookingsStudent(id);
      sendResponse(res, {
        message: "Bookings of student fetched.",
        data: result,
      });
    } else {
      res.status(403);
      throw new Error("Only tutor and student can access this route.");
    }
  } catch (error: any) {
    next(error);
  }
};

const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tutor_id, available_id, date_str, start_time, end_time } = req.body;

    if (!tutor_id) {
      res.status(400);
      throw new Error("Selecting tutor is required.");
    }

    if (!available_id) {
      res.status(400);
      throw new Error("Available id is required.");
    }

    if (!start_time || !end_time) {
      res.status(400);
      throw new Error("Start time and end time is required.");
    }

    const { date, endTime, startTime } = frontendTimeToBackendTime({
      dateStr: date_str,
      start_time,
      end_time,
    });

    if (!startTime || !endTime || !date) {
      res.status(400);
      throw new Error("Start time and end time is required.");
    }

    const diffMs = endTime.getTime() - startTime.getTime();

    if (diffMs <= 0) {
      res.status(400);
      throw new Error("Start time must be before end time.");
    }

    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

    await BookingsServices.createBooking({
      availableId: available_id as string,
      date,
      endTime,
      startTime,
      studentId: req.user?.id!,
      tutorId: tutor_id,
      diffHour: diffHours,
    });
    sendResponse(res, { message: "Booking created successfully." }, 201);
  } catch (error: any) {
    next(error);
  }
};

const getBookingDetails = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params?.id;

    if (!id) {
      res.status(400);
      throw new Error("ID is missing.");
    }
    const booking = await BookingsServices.getABooking(id);

    if (
      !booking ||
      (booking.studentId !== req.user?.id && booking.tutorId !== req.user?.id)
    ) {
      res.status(403);
      throw new Error("You are not allowed to access this booking.");
    }
    const result = await BookingsServices.getBookingDetails(id);
    sendResponse(
      res,
      { message: "Booking details fetched successfully.", data: result },
      200,
    );
  } catch (error: any) {
    next(error);
  }
};

const updateBookingStatus = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params?.id;
    const { status } = req.body;
    if (!id) {
      res.status(400);
      throw new Error("ID is missing.");
    }
    if (!status) {
      res.status(400);
      throw new Error("Status is required.");
    }
    const booking = await BookingsServices.getABooking(id);
    const isAllowed =
      (status === BookingStatus.completed &&
        booking?.tutorId === req.user?.id) ||
      (status === BookingStatus.cancelled &&
        booking?.studentId === req.user?.id);

    if (!isAllowed) {
      res.status(403);
      throw new Error(`You can't mark this booking as ${status}.`);
    }

    await BookingsServices.updateBookingStatus({ id, status });
    return sendResponse(res, {
      message: "Booking status changed successfully.",
    });
  } catch (error: any) {
    next(error);
  }
};

export const BookingsControllers = {
  getAllBookings,
  createBooking,
  getBookingDetails,
  updateBookingStatus,
};
