// Get the current tutor's own profile
const getSelfTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user id missing." });
    }
    // Find tutor profile by userId
    const result = await TutorsServices.getTutorProfileByUserId(userId);
    if (!result) {
      return res.status(404).json({ message: "Tutor profile not found." });
    }
    return sendResponse(res, {
      message: "Tutor profile fetched successfully.",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
import { NextFunction, Request, Response } from "express";
import { TutorsServices } from "./tutors.service";
import { sendResponse } from "../../../middleware/response.middleware";
import { paginationHandler } from "../../../handlers/paginationHandler";
import { sortingHandler } from "../../../handlers/sortingHandler";
import { CreateATutorParams, UpdateTutorParams } from "../../../types/tutors";
import { frontendTimeToBackendTime } from "../../../handlers/dateConvertHandler";

const getAllTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page =
      typeof req.query.page === "string" ? req.query.page : undefined;
    const size =
      typeof req.query.size === "string" ? req.query.size : undefined;
    const sort_by =
      typeof req.query.sort_by === "string" ? req.query.sort_by : undefined;
    const sort_order =
      typeof req.query.sort_order === "string"
        ? req.query.sort_order
        : undefined;
    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const { skip, take } = paginationHandler({ page, size });
    const { sortBy, sortOrder } = sortingHandler({ sort_by, sort_order });
    const result = await TutorsServices.getAllTutor({
      take,
      skip,
      sortBy,
      sortOrder,
      category,
      search,
    });
    return sendResponse(res, {
      message: "Tutors fetched successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getATutorDetails = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400);
      throw new Error("Id is required.");
    }
    const result = await TutorsServices.getATutorDetails(id);
    return sendResponse(res, {
      message: "Tutor data fetched successfully.",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const createTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      categoryId,
      end_time,
      pricePerHour,
      start_time,
      title,
      description,
    } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user id missing." });
    }
    // prevent duplicate tutor profile creation
    const existingProfile =
      await TutorsServices.getTutorProfileByUserId(userId);
    if (existingProfile) {
      res.status(409);
      throw new Error("Tutor profile already exists for this user.");
    }
    const { endTime, startTime } = frontendTimeToBackendTime({
      start_time,
      end_time,
    });
    if (!startTime || !endTime) {
      return res
        .status(400)
        .json({ message: "Start time and end time is required." });
    }
    if (!categoryId || !title || !pricePerHour) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const payload: CreateATutorParams = {
      categoryId,
      endTime,
      pricePerHour: Number(pricePerHour),
      startTime,
      title,
      userId,
    };
    if (description) {
      payload.description = description;
    }
    await TutorsServices.createTutor(payload);
    return sendResponse(res, { message: "Tutor created successfully." }, 201);
  } catch (error: any) {
    next(error);
  }
};

const updateTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user id missing." });
    }
    const {
      title,
      description,
      start_time,
      end_time,
      pricePerHour,
      active,
      categoryId,
    } = req.body;
    const params: UpdateTutorParams = { userId };
    if (title !== undefined) {
      params.title = title;
    }
    if (description !== undefined) {
      params.description = description;
    }
    if (start_time !== undefined) {
      params.startTime = frontendTimeToBackendTime({ start_time }).startTime;
    }
    if (end_time !== undefined) {
      params.endTime = frontendTimeToBackendTime({ end_time }).endTime;
    }
    if (pricePerHour !== undefined) {
      params.pricePerHour = Number(pricePerHour);
    }
    if (active !== undefined) {
      params.active = active === true || active === "true";
    }
    if (categoryId !== undefined) {
      params.categoryId = categoryId;
    }
    await TutorsServices.updateTutor(params);
    return sendResponse(res, { message: "Tutor updated successfully." });
  } catch (error: any) {
    next(error);
  }
};

const updateSlotTutor = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400);
      throw new Error("User id is required.");
    }

    const { days } = req.body;
    const payLoad = Array.isArray(days) ? [...days] : [];
    await TutorsServices.updateSlotTutor({ id, days: payLoad });
    sendResponse(res, { message: "Update slot successful." });
  } catch (error: any) {
    next(error);
  }
};

const updateAvailable = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user id missing." });
    }
    let active = req.body?.active;
    if (typeof active === "string") {
      active = active === "true";
    } else {
      active = Boolean(active);
    }
    await TutorsServices.updateAvailable({ id: userId, active });
    return sendResponse(res, { message: `Tutor status updated to ${active}` });
  } catch (error: any) {
    next(error);
  }
};

const getRatings = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400);
      throw new Error("User id is required.");
    }
    const result = await TutorsServices.getRatings(id);
    return sendResponse(res, {
      message: "Rating fetched successfully.",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const TutorsControllers = {
  createTutor,
  getAllTutor,
  getATutorDetails,
  getSelfTutorProfile,
  updateTutor,
  updateAvailable,
  getRatings,
  updateSlotTutor,
};
