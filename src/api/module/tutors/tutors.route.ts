import { Router, type Router as RouterType } from "express";
import { TutorsControllers } from "./tutors.controller";
import { auth } from "../../../middleware/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router: RouterType = Router();

// get all tutors with filters (public)
router.get("/", TutorsControllers.getAllTutor);

// get a tutor details (public)
router.get("/:id", TutorsControllers.getATutorDetails);

// view rating or review route of a tutor (tutor)
router.get("/rating/:id", auth(UserRole.tutor), TutorsControllers.getRatings);

// create a tutor profile (tutor)
router.post("/", auth(UserRole.tutor), TutorsControllers.createTutor);

// update a tutor profile (tutor)
router.patch("/:id", auth(UserRole.tutor), TutorsControllers.updateTutor);

// active or deactivate a tutor profile (tutor)
router.patch(
  "/active/:id",
  auth(UserRole.tutor),
  TutorsControllers.updateAvailable,
);

// available slot update of the tutor (tutor)
router.patch(
  "/slot/:id",
  auth(UserRole.tutor),
  TutorsControllers.updateSlotTutor,
);

export { router as TutorsRoutes };
