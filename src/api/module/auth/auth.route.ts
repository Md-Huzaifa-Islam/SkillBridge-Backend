import { toNodeHandler } from "better-auth/node";
import { Router, type Router as RouterType } from "express";
import { sanitizeRegistration } from "../../../middleware/sanitizeRegister.middleware";

const router: RouterType = Router();

router.use("/:splat", sanitizeRegistration, toNodeHandler);

export { router as AuthRoutes };
