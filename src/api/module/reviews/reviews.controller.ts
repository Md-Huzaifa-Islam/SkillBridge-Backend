import { NextFunction, Request, Response } from "express";
import { ReviewsServices } from "./reviews.service";
import { sendResponse } from "../../../middleware/response.middleware";
import { BookingStatus } from "../../../../generated/prisma/enums";

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
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params?.id;
    const { review, rating = 0 } = req.body;
    if (!id) {
      res.status(400);
      throw new Error("ID is missing.");
    }

    const booking = await ReviewsServices.getBooking(id);

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

    await ReviewsServices.createReviews({
      bookingId: id,
      rating,
      review,
    });

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

    const { rating, review } = req.body;

    if (!rating && !review) {
      res.status(400);
      throw new Error("Review and rating both are missing.");
    }

    const booking = await ReviewsServices.getBooking(id);

    if (booking?.studentId != req.user?.id) {
      res.status(403);
      throw new Error("You can't create this user's booking.");
    }

    const result = await ReviewsServices.updateReviews({
      rating,
      review,
      reviewId: id,
    });
    if (true) {
      res.status(200);
      throw new Error("This is template");
    }
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
