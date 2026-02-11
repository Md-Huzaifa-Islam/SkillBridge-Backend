import { Router } from "express";
import { AdminController } from "./admin.controller";
import { auth } from "../../middleware/auth";
import { UsersRole } from "../../generated/prisma/enums";
import { validate } from "../../lib/asyncHandler";
import { updateUserStatusSchema } from "../../lib/validation";

const router = Router();

router.get("/users", auth(UsersRole.admin), AdminController.getAllUsers);
router.get("/bookings", auth(UsersRole.admin), AdminController.getAllBookings);
router.patch(
  "/users/:id",
  auth(UsersRole.admin),
  validate(updateUserStatusSchema),
  AdminController.updateUserStatus,
);

export { router as AdminRoutes };
