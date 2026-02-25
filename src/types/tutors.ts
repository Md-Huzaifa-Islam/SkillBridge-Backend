export type GetAllTutorsParams = {
  take: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
  category?: string;
  search?: string;
};

export type CreateATutorParams = {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  pricePerHour: number;
  categoryId: string;
  userId: string;
};

export type UpdateTutorParams = {
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  pricePerHour?: number;
  active?: boolean;
  categoryId?: string;
  userId: string;
};
