import { Request, Response } from "express";
import { ReviewsService } from "./reviews.service";

export class ReviewsController {
  static async createReview(req: Request, res: Response) {
    try {
      const studentId = req.user?.id;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const { booking_id, rating, review } = req.body;

      // Validate required fields
      if (!booking_id || !rating) {
        return res.status(400).json({
          success: false,
          message: "booking_id and rating are required",
        });
      }

      // Validate rating range
      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be a number between 1 and 5",
        });
      }

      const createdReview = await ReviewsService.createReview(studentId, {
        booking_id,
        rating,
        review,
      });

      return res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: createdReview,
      });
    } catch (error: any) {
      console.error("Error creating review:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to create review",
      });
    }
  }
}
