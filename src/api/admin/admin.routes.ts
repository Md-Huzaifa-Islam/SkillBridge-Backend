import { Router } from "express";
import { AdminController } from "./admin.controller";
import { auth } from "../../middleware/auth";
import { UsersRole } from "../../generated/prisma/enums";

const router = Router();

// Get all users - only accessible by admin role
router.get("/users", auth(UsersRole.admin), AdminController.getAllUsers);

// Get all bookings - only accessible by admin role
router.get("/bookings", auth(UsersRole.admin), AdminController.getAllBookings);

// Update user status - only accessible by admin role
router.patch(
  "/users/:id",
  auth(UsersRole.admin),
  AdminController.updateUserStatus,
);

export { router as AdminRoutes };
