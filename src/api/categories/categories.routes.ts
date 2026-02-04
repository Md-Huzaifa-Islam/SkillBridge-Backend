import { Router } from "express";
import { CategoriesController } from "./categories.controller";
import { UsersRole } from "../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

// Get all categories
router.get("/", CategoriesController.getAllCategories);

// Create a new category
router.post("/", auth(UsersRole.admin), CategoriesController.createCategory);

// Delete a category
router.delete(
  "/:id",
  auth(UsersRole.admin),
  CategoriesController.deleteCategory,
);

export { router as CategoriesRoutes };
