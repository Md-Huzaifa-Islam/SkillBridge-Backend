import { Router } from "express";
import { ReviewsController } from "./reviews.controller";
import { auth } from "../../middleware/auth";
import { UsersRole } from "../../generated/prisma/enums";
import { validate } from "../../lib/asyncHandler";
import { createReviewSchema } from "../../lib/validation";

const router = Router();

router.post(
  "/",
  auth(UsersRole.student),
  validate(createReviewSchema),
  ReviewsController.createReview,
);

export { router as ReviewsRoutes };
