import { Router } from "express";
import { CategoriesController } from "./categories.controller";
import { UsersRole } from "../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validate } from "../../lib/asyncHandler";
import { createCategorySchema } from "../../lib/validation";

const router = Router();

router.get("/", CategoriesController.getAllCategories);
router.post(
  "/",
  auth(UsersRole.admin),
  validate(createCategorySchema),
  CategoriesController.createCategory,
);
router.delete(
  "/:id",
  auth(UsersRole.admin),
  CategoriesController.deleteCategory,
);

export { router as CategoriesRoutes };
