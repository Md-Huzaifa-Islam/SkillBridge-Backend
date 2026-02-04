import { Router } from "express";
import { TutorsControllers } from "./tutors.controller";

const router = Router();

router.get("/", TutorsControllers.getTutors);

router.get("/:id", TutorsControllers.getATutor);

export { router as TutorsRoutes };
