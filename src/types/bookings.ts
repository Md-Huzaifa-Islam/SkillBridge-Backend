import { BookingStatus } from "../../generated/prisma/enums";

export type CreateBookingParams = {
  tutorId: string;
  studentId: string;
  availableId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  diffHour: number;
};

export type UpdateBookingParams = {
  id: string;
  status: BookingStatus;
};
