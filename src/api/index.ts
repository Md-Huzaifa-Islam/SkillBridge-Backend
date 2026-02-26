import { Router, type Router as RouterType } from "express";
import { AuthRoutes } from "./module/auth/auth.route";
import { BookingsRoutes } from "./module/bookings/bookings.route";
import { CategoriesRoutes } from "./module/categories/categories.route";
import { ReviewsRoutes } from "./module/reviews/reviews.route";
import { TutorsRoutes } from "./module/tutors/tutors.route";

const router: RouterType = Router();

// auth route
router.use("/auth", AuthRoutes);

// bookings route
router.use("/bookings", BookingsRoutes);

// categories route
router.use("/categories", CategoriesRoutes);

// reviews route
router.use("/reviews", ReviewsRoutes);

// tutors route
router.use("/tutors", TutorsRoutes);

export { router as ApiRoutes };
