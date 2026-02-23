import { Router, type Router as RouterType } from "express";
import { ReviewsControllers } from "./reviews.controller";
import { auth } from "../../../middleware/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router: RouterType = Router();

// get ratings of a tutor profile
router.get(
  "/:id",
  auth(UserRole.admin, UserRole.student, UserRole.tutor),
  ReviewsControllers.getReviews,
);

// create a rating
router.post("/:id", auth(UserRole.student), ReviewsControllers.createReviews);

// update a rating
router.patch("/:id", auth(UserRole.student), ReviewsControllers.updateReviews);

router.delete(
  "/:id",
  auth(UserRole.admin, UserRole.student),
  ReviewsControllers.deleteReviews,
);

export { router as ReviewsRoutes };
