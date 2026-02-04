import { Router } from "express";
import { TutorController } from "./tutor.controller";
import { auth } from "../../middleware/auth";
import { UsersRole } from "../../generated/prisma/enums";

const router = Router();

// Update tutor profile - only accessible by teacher role
router.put("/profile", auth(UsersRole.teacher), TutorController.updateProfile);

// Update availability - only accessible by teacher role
router.put(
  "/availability",
  auth(UsersRole.teacher),
  TutorController.updateAvailability,
);

export { router as TutorRoutes };
