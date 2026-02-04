import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { UsersRole } from "../../generated/prisma/enums";

/**
 * Admin controller for managing users and platform operations
 */
export class AdminController {
  /**
   * Get all users in the system
   * @route GET /api/admin/users
   * @access Private (Admin only)
   */
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await AdminService.getAllUsers();

      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error: any) {
      console.error("Error fetching users:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to fetch users",
      });
    }
  }

  /**
   * Update user status (ban/unban) or role
   * @route PATCH /api/admin/users/:id
   * @access Private (Admin only)
   */
  static async updateUserStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { is_banned, role } = req.body as {
        is_banned?: boolean;
        role?: UsersRole;
      };

      // Validate that at least one field is provided
      if (is_banned === undefined && !role) {
        return res.status(400).json({
          success: false,
          message: "At least one field (is_banned or role) is required",
        });
      }

      // Validate role if provided
      if (role && !["student", "teacher", "admin"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role. Must be student, teacher, or admin",
        });
      }

      const updatedUser = await AdminService.updateUserStatus(id, {
        is_banned,
        role,
      });

      return res.status(200).json({
        success: true,
        message: "User status updated successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      console.error("Error updating user status:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update user status",
      });
    }
  }
}
