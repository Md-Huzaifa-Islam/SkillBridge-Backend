import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validate } from "../../../middleware/validate.middleware";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
} from "./auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), AuthControllers.register);
router.post("/login", validate(loginSchema), AuthControllers.login);
router.get("/me", AuthControllers.me);
router.post(
  "/verify",
  validate(verifyEmailSchema),
  AuthControllers.verifyEmail,
);

export { router as AuthRoutes };
