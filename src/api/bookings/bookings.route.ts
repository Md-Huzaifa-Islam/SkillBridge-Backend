import { Router } from "express";
import { BookingsController } from "./bookings.controller";
import { auth } from "../../middleware/auth";
import { UsersRole } from "../../generated/prisma/enums";
import { validate } from "../../lib/asyncHandler";
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "../../lib/validation";

const router = Router();

router.post(
  "/",
  auth(UsersRole.student),
  validate(createBookingSchema),
  BookingsController.createBooking,
);

router.get(
  "/",
  auth(UsersRole.student, UsersRole.teacher, UsersRole.admin),
  BookingsController.getUserBookings,
);

router.get(
  "/:id",
  auth(UsersRole.student, UsersRole.teacher, UsersRole.admin),
  BookingsController.getBookingDetails,
);

router.patch(
  "/:id",
  auth(UsersRole.student, UsersRole.teacher, UsersRole.admin),
  validate(updateBookingStatusSchema),
  BookingsController.updateBookingStatus,
);

export { router as BookingRoutes };
