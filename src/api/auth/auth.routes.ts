import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { UsersRole } from "../../generated/prisma/enums";
import { validate } from "../../lib/asyncHandler";
import { registerSchema, loginSchema } from "../../lib/validation";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  AuthControllers.registerUser,
);
router.post("/login", validate(loginSchema), AuthControllers.loginUser);
router.post("/logout", AuthControllers.logoutUser);
router.get("/verify-email", AuthControllers.verifyEmail);
router.get(
  "/me",
  auth(UsersRole.admin, UsersRole.student, UsersRole.teacher),
  AuthControllers.userDetails,
);

export { router as AuthRoutes };
