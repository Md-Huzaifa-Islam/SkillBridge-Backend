import { Router } from "express";
import { TutorController } from "./tutor.controller";
import { auth } from "../../middleware/auth";
import { UsersRole } from "../../generated/prisma/enums";
import { validate } from "../../lib/asyncHandler";
import {
  updateTutorProfileSchema,
  updateAvailabilitySchema,
} from "../../lib/validation";

const router = Router();

router.get("/profile", auth(UsersRole.teacher), TutorController.getProfile);
router.put(
  "/profile",
  auth(UsersRole.teacher),
  validate(updateTutorProfileSchema),
  TutorController.updateProfile,
);
router.get("/sessions", auth(UsersRole.teacher), TutorController.getSessions);
router.put(
  "/availability",
  auth(UsersRole.teacher),
  validate(updateAvailabilitySchema),
  TutorController.updateAvailability,
);

export { router as TutorRoutes };
