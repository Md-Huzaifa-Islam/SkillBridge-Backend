import { Request, Response } from "express";
import { TutorsServices } from "./tutors.service";
import { GetTutorsQuery } from "../../types/tutors";

/**
 * Get all tutors with filtering and pagination
 * @route GET /api/tutors
 * @access Public
 */
const getTutors = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutors",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getATutor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid tutor ID is required",
      });
    }

    const tutor = await TutorsServices.getATutor(id);

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found or has no tutor profiles",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tutor details retrieved successfully",
      data: tutor,
    });
  } catch (error) {
    console.error("Error fetching tutor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutor details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const TutorsControllers = {
  getTutors,
  getATutor,
};
