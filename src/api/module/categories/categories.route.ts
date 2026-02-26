import { Router, type Router as RouterType } from "express";
import { CategoriesControllers } from "./categories.controller";
import { authenticate } from "../../../middleware/jwtAuth";
import { UserRole } from "../../../../generated/prisma/enums";
import { validate } from "../../../middleware/validate.middleware";
import { categorySchema } from "../validation/zodSchemas";

const router: RouterType = Router();

// get all categories
router.get("/", CategoriesControllers.getCategories);

// create route body{name}
router.post(
  "/",
  authenticate(UserRole.admin),
  validate(categorySchema),
  CategoriesControllers.createCategory,
);

// update route body{name}
router.patch(
  "/:id",
  authenticate(UserRole.admin),
  validate(categorySchema),
  CategoriesControllers.updateCategory,
);

// delete route
router.delete(
  "/:id",
  authenticate(UserRole.admin),
  CategoriesControllers.deleteCategory,
);

export { router as CategoriesRoutes };
