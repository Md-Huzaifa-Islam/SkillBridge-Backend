import { Router } from "express";
import { AuthRoutes } from "./auth/auth.routes";
import { TutorsRoutes } from "./tutors/tutors.route";
import { CategoriesRoutes } from "./categories/categories.routes";
import { BookingRoutes } from "./bookings/bookings.route";
import { TutorRoutes } from "./tutor/tutor.route";
import { ReviewsRoutes } from "./reviews/reviews.routes";
import { AdminRoutes } from "./admin/admin.routes";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

router.use("/auth", AuthRoutes);

router.use("/tutors", TutorsRoutes);

router.use("/tutor", TutorRoutes);

router.use("/categories", CategoriesRoutes);

router.use("/bookings", BookingRoutes);

router.use("/reviews", ReviewsRoutes);

router.use("/admin", AdminRoutes);

export { router as ApiRoutes };
