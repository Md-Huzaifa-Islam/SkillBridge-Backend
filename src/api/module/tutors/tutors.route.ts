import { Router, type Router as RouterType } from "express";
import { TutorsControllers } from "./tutors.controller";
import { authenticate } from "../../../middleware/jwtAuth";
import { UserRole } from "../../../../generated/prisma/enums";
import { validate } from "../../../middleware/validate.middleware";
import {
  tutorProfileSchema,
  tutorProfileUpdateSchema,
} from "../validation/zodSchemas";

const router: RouterType = Router();

// get self tutor profile (tutor)
router.get(
  "/me",
  authenticate(UserRole.tutor),
  TutorsControllers.getSelfTutorProfile,
);

// get all tutors with filters (public)
router.get("/", TutorsControllers.getAllTutor);

// get a tutor details (public)
router.get("/:id", TutorsControllers.getATutorDetails);

// view rating or review route of a tutor (tutor, student, admin)
router.get(
  "/rating/:id",
  authenticate(UserRole.tutor, UserRole.student, UserRole.admin),
  TutorsControllers.getRatings,
);

// create a tutor profile (tutor)
router.post(
  "/",
  authenticate(UserRole.tutor),
  validate(tutorProfileSchema),
  TutorsControllers.createTutor,
);

// update self tutor profile (tutor)
router.patch(
  "/me",
  authenticate(UserRole.tutor),
  validate(tutorProfileUpdateSchema),
  TutorsControllers.updateTutor,
);

// activate or deactivate self tutor profile (tutor)
router.patch(
  "/active/me",
  authenticate(UserRole.tutor),
  TutorsControllers.updateAvailable,
);

// available slot update of the tutor (tutor)
router.patch(
  "/slot/:id",
  authenticate(UserRole.tutor),
  TutorsControllers.updateSlotTutor,
);

export { router as TutorsRoutes };
