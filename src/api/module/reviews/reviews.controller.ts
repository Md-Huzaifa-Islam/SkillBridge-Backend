import { NextFunction, Request, Response } from "express";
import { ReviewsServices } from "./reviews.service";
import { sendResponse } from "../../../middleware/response.middleware";
import { BookingStatus } from "../../../../generated/prisma/enums";
import { BookingsServices } from "../bookings/bookings.service";

const getReviews = async (
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
    const result = await ReviewsServices.getReviews(id);
    sendResponse(res, {
      message: "Reviews fetched successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const createReviews = async (
  req: Request<{ id?: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paramId = req.params?.id;
    const { bookingId: bodyBookingId, review, rating = 0 } = req.body as any;
    const bookingId = paramId || bodyBookingId;
    if (!bookingId) {
      res.status(400);
      throw new Error("Booking ID is missing.");
    }

    const booking = await BookingsServices.getABooking(bookingId);

    if (!booking) {
      res.status(404);
      throw new Error("Can't find the booking.");
    }

    if (booking.studentId != req.user?.id) {
      res.status(403);
      throw new Error("You can't create this user's booking.");
    }

    if (booking.status != BookingStatus.completed) {
      res.status(403);
      throw new Error("Cannot create a review. Session is not completed.");
    }

    // Prevent duplicate review creation for the same booking
    const existingReview =
      await ReviewsServices.getReviewByBookingId(bookingId);
    if (existingReview) {
      res.status(409);
      throw new Error("Review already exists for this booking.");
    }

    await ReviewsServices.createReviews({ bookingId, rating, review });

    sendResponse(res, { message: "Review created successfully." }, 201);
  } catch (error: any) {
    next(error);
  }
};

const updateReviews = async (
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

    const { rating, review } = req.body as any;

    if (rating === undefined && review === undefined) {
      res.status(400);
      throw new Error("Review and rating both are missing.");
    }

    const existing = await ReviewsServices.getReviewById(id);

    if (!existing) {
      res.status(404);
      throw new Error("Review not found.");
    }

    if (existing.booking?.studentId !== req.user?.id) {
      res.status(403);
      throw new Error("You are not allowed to update this review.");
    }

    await ReviewsServices.updateReviews({
      rating,
      review,
      reviewId: id,
    });

    sendResponse(res, { message: "Review updated successfully." });
  } catch (error: any) {
    next(error);
  }
};

const deleteReviews = async (
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
    await ReviewsServices.deleteReviews(id);
    sendResponse(res, { message: "Review deleted successfully." });
  } catch (error: any) {
    next(error);
  }
};

export const ReviewsControllers = {
  getReviews,
  createReviews,
  updateReviews,
  deleteReviews,
};
