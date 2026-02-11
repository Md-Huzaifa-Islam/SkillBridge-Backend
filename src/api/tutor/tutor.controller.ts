import { Request, Response } from "express";
import { TutorService } from "./tutor.service";
import { catchAsync } from "../../lib/asyncHandler";
import { AppError } from "../../lib/AppError";

export class TutorController {
  static getProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("User not authenticated", 401);

    const profile = await TutorService.getProfile(userId);

    if (!profile) {
      throw new AppError(
        "Tutor profile not found. Please create one first.",
        404,
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: profile,
    });
  });

  static getSessions = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("User not authenticated", 401);

    const sessions = await TutorService.getSessions(userId);

    res.status(200).json({
      success: true,
      message: "Sessions retrieved successfully",
      data: sessions,
    });
  });

  static updateProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("User not authenticated", 401);

    const { description, price_per_hour, category_id } = req.body;

    if (!description && !price_per_hour && !category_id) {
      throw new AppError("At least one field is required to update", 400);
    }

    const updatedProfile = await TutorService.updateProfile(userId, {
      description,
      price_per_hour,
      category_id,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  });

  static updateAvailability = catchAsync(
    async (req: Request, res: Response) => {
      const userId = req.user?.id;
      if (!userId) throw new AppError("User not authenticated", 401);

      const { availability } = req.body;

      const updatedAvailability = await TutorService.updateAvailability(
        userId,
        availability,
      );

      res.status(200).json({
        success: true,
        message: "Availability updated successfully",
        data: updatedAvailability,
      });
    },
  );
}
