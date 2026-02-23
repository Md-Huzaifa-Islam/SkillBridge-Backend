import { Router, type Router as RouterType } from "express";
import { CategoriesControllers } from "./categories.controller";
import { auth } from "../../../middleware/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router: RouterType = Router();

// get all categories

router.get("/", CategoriesControllers.getCategories);

// create route body{name}
router.post("/", auth(UserRole.admin), CategoriesControllers.createCategory);

// update route body{name}
router.patch(
  "/:id",
  auth(UserRole.admin),
  CategoriesControllers.updateCategory,
);

// delete route
router.delete(
  "/:id",
  auth(UserRole.admin),
  CategoriesControllers.deleteCategory,
);

export { router as CategoriesRoutes };
