import { Request, Response } from "express";
import { TutorService } from "./tutor.service";

export class TutorController {
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const { description, price_per_hour, category_id } = req.body;

      // Validate required fields
      if (!description && !price_per_hour && !category_id) {
        return res.status(400).json({
          success: false,
          message: "At least one field is required to update the profile",
        });
      }

      const updatedProfile = await TutorService.updateProfile(userId, {
        description,
        price_per_hour,
        category_id,
      });

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (error: any) {
      console.error("Error updating tutor profile:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update profile",
      });
    }
  }

  static async updateAvailability(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const { availability } = req.body;

      // Validate availability array
      if (!Array.isArray(availability) || availability.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Availability must be a non-empty array",
        });
      }

      // Validate each availability entry
      for (const avail of availability) {
        if (!avail.day || !avail.start_time || !avail.end_time) {
          return res.status(400).json({
            success: false,
            message:
              "Each availability entry must have day, start_time, and end_time",
          });
        }
      }

      const updatedAvailability = await TutorService.updateAvailability(
        userId,
        availability,
      );

      return res.status(200).json({
        success: true,
        message: "Availability updated successfully",
        data: updatedAvailability,
      });
    } catch (error: any) {
      console.error("Error updating availability:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update availability",
      });
    }
  }
}
