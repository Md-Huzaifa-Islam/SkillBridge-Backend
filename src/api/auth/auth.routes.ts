import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { UsersRole } from "../../generated/prisma/enums";

const router = Router();

// register a user
router.post("/register", AuthControllers.registerUser);

// login a user
router.post("/login", AuthControllers.loginUser);

// get user details
router.get(
  "/me",
  auth(UsersRole.admin, UsersRole.student, UsersRole.teacher),
  AuthControllers.userDetails,
);

export { router as AuthRoutes };
