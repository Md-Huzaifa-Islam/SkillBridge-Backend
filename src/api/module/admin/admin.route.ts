import { Router } from "express";
import { AdminControllers } from "./admin.controller";
import { authenticate } from "../../../middleware/jwtAuth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();

// GET /admin/users?role=&status=&search=&page=&size=
router.get("/users", authenticate(UserRole.admin), AdminControllers.getUsers);

// GET /admin/users/:id
router.get(
  "/users/:id",
  authenticate(UserRole.admin),
  AdminControllers.getUserDetail,
);

// PATCH /admin/users/:id  — body: { status: "active" | "banned" }
router.patch(
  "/users/:id",
  authenticate(UserRole.admin),
  AdminControllers.updateUser,
);

export { router as AdminRoutes };
