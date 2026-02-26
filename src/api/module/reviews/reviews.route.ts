import { Router, type Router as RouterType } from "express";
import { ReviewsControllers } from "./reviews.controller";
import { authenticate } from "../../../middleware/jwtAuth";
import { UserRole } from "../../../../generated/prisma/enums";
import { validate } from "../../../middleware/validate.middleware";
import { reviewSchema } from "../validation/zodSchemas";

const router: RouterType = Router();

// get ratings of a tutor profile
router.get(
  "/:id",
  authenticate(UserRole.admin, UserRole.student, UserRole.tutor),
  ReviewsControllers.getReviews,
);

// create a rating
router.post(
  ":id",
  authenticate(UserRole.student),
  validate(reviewSchema),
  ReviewsControllers.createReviews,
);

// update a rating
router.patch(
  ":id",
  authenticate(UserRole.student),
  validate(reviewSchema),
  ReviewsControllers.updateReviews,
);

router.delete(
  "/:id",
  authenticate(UserRole.admin, UserRole.student),
  ReviewsControllers.deleteReviews,
);

export { router as ReviewsRoutes };
