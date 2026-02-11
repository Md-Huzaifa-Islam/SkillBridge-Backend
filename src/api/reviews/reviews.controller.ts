import { Request, Response } from "express";
import { ReviewsService } from "./reviews.service";
import { catchAsync } from "../../lib/asyncHandler";
import { AppError } from "../../lib/AppError";

export class ReviewsController {
  static createReview = catchAsync(async (req: Request, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throw new AppError("User not authenticated", 401);

    const { booking_id, rating, review } = req.body;

    const createdReview = await ReviewsService.createReview(studentId, {
      booking_id,
      rating,
      review,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: createdReview,
    });
  });
}
