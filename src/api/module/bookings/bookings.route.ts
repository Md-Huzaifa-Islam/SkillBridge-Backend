import { Router, type Router as RouterType } from "express";
import { BookingsControllers } from "./bookings.controller";
import { auth } from "../../../middleware/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router: RouterType = Router();

// get all booking of a user (student, tutor)
router.get(
  "/",
  auth(UserRole.tutor, UserRole.student),
  BookingsControllers.getAllBookings,
);

// get a booking details
router.get(
  "/:id",
  auth(UserRole.tutor, UserRole.student),
  BookingsControllers.getBookingDetails,
);

// create new booking
router.post("/", auth(UserRole.student), BookingsControllers.createBooking);

// update status (tutor -> confirms , student -> cancel)
router.patch(
  "/:id",
  auth(UserRole.student, UserRole.tutor),
  BookingsControllers.updateBookingStatus,
);

export { router as BookingsRoutes };
