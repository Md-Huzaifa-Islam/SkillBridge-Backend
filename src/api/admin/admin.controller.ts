import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { catchAsync } from "../../lib/asyncHandler";
import { AppError } from "../../lib/AppError";

export class AdminController {
  static getAllUsers = catchAsync(async (_req: Request, res: Response) => {
    const users = await AdminService.getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  });

  static getAllBookings = catchAsync(async (_req: Request, res: Response) => {
    const bookings = await AdminService.getAllBookings();

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  });

  static updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { is_banned, role } = req.body;

    if (is_banned === undefined && !role) {
      throw new AppError(
        "At least one field (is_banned or role) is required",
        400,
      );
    }

    const updatedUser = await AdminService.updateUserStatus(id, {
      is_banned,
      role,
    });

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: updatedUser,
    });
  });
}
