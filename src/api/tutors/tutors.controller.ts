import { Request, Response } from "express";
import { TutorsServices } from "./tutors.service";
import { GetTutorsQuery } from "../../types/tutors";
import { catchAsync } from "../../lib/asyncHandler";
import { AppError } from "../../lib/AppError";

const getTutors = catchAsync(async (req: Request, res: Response) => {
  const query: GetTutorsQuery = {
    search: req.query.search as string,
    sortBy: req.query.sortBy as "name" | "email" | "createdAt",
    sortOrder: req.query.sortOrder as "asc" | "desc",
    category: req.query.category as string,
    featured: req.query.featured as "true" | "false",
    page: req.query.page as string,
    limit: req.query.limit as string,
  };

  const result = await TutorsServices.getTutors(query);

  res.status(200).json({
    success: true,
    message: "Tutors retrieved successfully",
    ...result,
  });
});

const getATutor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    throw new AppError("Valid tutor ID is required", 400);
  }

  const tutor = await TutorsServices.getATutor(id);

  if (!tutor) {
    throw new AppError("Tutor not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Tutor details retrieved successfully",
    data: tutor,
  });
});

export const TutorsControllers = {
  getTutors,
  getATutor,
};
