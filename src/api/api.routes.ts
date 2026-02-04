import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import { AuthRoutes } from "./auth/auth.routes";

const router = Router();

// this is for authentication
router.use("/auth", AuthRoutes);

// tutor routes
// router.use("/tutors",)

// bookings routes
// router.use('/bookings',)

// reviews routes

export { router as ApiRoutes };
