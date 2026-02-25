import { NextFunction, Request, Response } from "express";
import { TutorsServices } from "./tutors.service";
import { sendResponse } from "../../../middleware/response.middleware";
import { paginationHandler } from "../../../handlers/paginationHandler";
import { sortingHandler } from "../../../handlers/sortingHandler";
import { CreateATutorParams, UpdateTutorParams } from "../../../types/tutors";
import { frontendTimeToBackendTime } from "../../../handlers/dateConvertHandler";

const getAllTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, size, sort_by, sort_order, category, search } = req.body;
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
    const userId = req.user?.id!;
    const { endTime, startTime } = frontendTimeToBackendTime({
      start_time,
      end_time,
    });
    if (!startTime || !endTime) {
      res.status(400);
      throw new Error("Start time and end time is required.");
    }
    const payload: CreateATutorParams = {
      categoryId,
      endTime,
      pricePerHour,
      startTime,
      title,
      userId,
    };
    if (description) {
      payload.description = description;
    }
    await TutorsServices.createTutor(payload);
    sendResponse(res, { message: "Tutor created successfully." }, 201);
  } catch (error: any) {
    next(error);
  }
};

const updateTutor = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title,
      description,
      start_time,
      end_time,
      pricePerHour,
      active,
      categoryId,
    } = req.body;
    const userId = req.params.id;
    if (!userId) {
      res.status(400);
      throw new Error("User id is required.");
    }
    const params: UpdateTutorParams = { userId };
    if (title) {
      params.title = title;
    }
    if (description) {
      params.description = description;
    }
    if (start_time) {
      params.startTime = frontendTimeToBackendTime({ start_time }).startTime;
    }
    if (end_time) {
      params.endTime = frontendTimeToBackendTime({ end_time }).endTime;
    }
    if (pricePerHour) {
      params.pricePerHour = Number(pricePerHour);
    }
    if (active) {
      params.active = active === "true";
    }
    if (categoryId) {
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
    const active = req.body?.active === "true";
    await TutorsServices.updateAvailable({ id, active });
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
  updateTutor,
  updateAvailable,
  getRatings,
  updateSlotTutor,
};
