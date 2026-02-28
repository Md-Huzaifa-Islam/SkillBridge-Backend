import { Router, type Router as RouterType } from "express";
import { BookingsControllers } from "./bookings.controller";
import { authenticate } from "../../../middleware/jwtAuth";
import { UserRole } from "../../../../generated/prisma/enums";
import { validate } from "../../../middleware/validate.middleware";
import { bookingSchema } from "../validation/zodSchemas";

const router: RouterType = Router();

// get all booking of a user (student, tutor) or all bookings (admin)
router.get(
  "/",
  authenticate(UserRole.tutor, UserRole.student, UserRole.admin),
  BookingsControllers.getAllBookings,
);

// get a booking details
router.get(
  "/:id",
  authenticate(UserRole.tutor, UserRole.student),
  BookingsControllers.getBookingDetails,
);

// create new booking
router.post(
  "/",
  authenticate(UserRole.student),
  validate(bookingSchema),
  BookingsControllers.createBooking,
);

// update status (tutor -> confirms , student -> cancel)
router.patch(
  "/:id",
  authenticate(UserRole.student, UserRole.tutor),
  BookingsControllers.updateBookingStatus,
);

export { router as BookingsRoutes };
