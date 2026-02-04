import { Router } from "express";
import { ReviewsController } from "./reviews.controller";
import { auth } from "../../middleware/auth";
import { UsersRole } from "../../generated/prisma/enums";

const router = Router();

// Create review - only accessible by student role
router.post("/", auth(UsersRole.student), ReviewsController.createReview);

export { router as ReviewsRoutes };
