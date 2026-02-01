import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";

const router = Router();

// betterauth management system
router.all("/auth/{*any}", toNodeHandler(auth));

// tutor routes
// router.use("/tutors",)

// bookings routes
// router.use('/bookings',)

// reviews routes

export { router as ApiRoutes };
