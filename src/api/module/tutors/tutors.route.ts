import { Router, type Router as RouterType } from "express";
import { TutorsControllers } from "./tutors.controller";
import { authenticate } from "../../../middleware/jwtAuth";
import { UserRole } from "../../../../generated/prisma/enums";
import { validate } from "../../../middleware/validate.middleware";
import { tutorProfileSchema } from "../validation/zodSchemas";

const router: RouterType = Router();

// get all tutors with filters (public)
router.get("/", TutorsControllers.getAllTutor);

// get a tutor details (public)
router.get("/:id", TutorsControllers.getATutorDetails);

// view rating or review route of a tutor (tutor)
router.get(
  "/rating/:id",
  authenticate(UserRole.tutor),
  TutorsControllers.getRatings,
);

// create a tutor profile (tutor)
router.post(
  "/",
  authenticate(UserRole.tutor),
  validate(tutorProfileSchema),
  TutorsControllers.createTutor,
);

// update a tutor profile (tutor)
router.patch(
  ":id",
  authenticate(UserRole.tutor),
  validate(tutorProfileSchema),
  TutorsControllers.updateTutor,
);

// active or deactivate a tutor profile (tutor)
router.patch(
  "/active/:id",
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
