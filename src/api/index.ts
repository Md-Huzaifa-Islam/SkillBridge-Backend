import { Router, type Router as RouterType } from "express";
import { AdminRoutes } from "./module/admin/admin.route";
import { AuthRoutes } from "./module/auth/auth.route";
import { BookingsRoutes } from "./module/bookings/bookings.route";
import { CategoriesRoutes } from "./module/categories/categories.route";
import { ReviewsRoutes } from "./module/reviews/reviews.route";
import { TutorRoutes } from "./module/tutor/tutor.route";
import { TutorsRoutes } from "./module/tutors/tutors.route";

const router: RouterType = Router();

// admin route
router.use("/admin", AdminRoutes);

// auth route
router.use("/auth", AuthRoutes);

// bookings route
router.use("/bookings", BookingsRoutes);

// categories route
router.use("/categories", CategoriesRoutes);

// reviews route
router.use("/reviews", ReviewsRoutes);

// tutor route
router.use("/tutor", TutorRoutes);

// tutors route
router.use("/tutors", TutorsRoutes);

export { router as ApiRoutes };
