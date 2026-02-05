import { Router } from "express";
import { BookingsController } from "./bookings.controller";
import { auth } from "../../middleware/auth";
import { UsersRole } from "../../generated/prisma/enums";

const router = Router();

router.post("/", auth(UsersRole.student), BookingsController.createBooking);

router.get(
  "/",
  auth(UsersRole.student, UsersRole.admin),
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
  BookingsController.updateBookingStatus,
);

export { router as BookingRoutes };
