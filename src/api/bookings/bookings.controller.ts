import { Request, Response } from "express";
import { BookingsService } from "./bookings.service";

/**
 * Create a new booking for a tutoring session
 * @route POST /api/bookings
 * @access Private (Student)
 */
const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    const { tutor_id, start_time, end_time, date } = req.body;

    if (!tutor_id || !start_time || !end_time || !date) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: tutor_id, start_time, end_time, date",
      });
    }

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
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = (req.user as any)?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    const query = {
      page: req.query.page as string,
      limit: req.query.limit as string,
      status: req.query.status as string,
    };

    const result = await BookingsService.getUserBookings(
      userId,
      userRole,
      query,
    );

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      ...result,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getBookingDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = (req.user as any)?.role;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid booking ID is required",
      });
    }

    const booking = await BookingsService.getBookingDetails(
      id,
      userId,
      userRole,
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking details retrieved successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = (req.user as any)?.role;
    const { id } = req.params;
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid booking ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ["confirm", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

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
  } catch (error: any) {
    console.error("Error updating booking status:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update booking status",
    });
  }
};

export const BookingsController = {
  createBooking,
  getUserBookings,
  getBookingDetails,
  updateBookingStatus,
};
