export type CreateReviewParams = {
  bookingId: string;
  rating: number;
  review?: string;
};

export type UpdateReviewParams = {
  reviewId: string;
  rating?: number;
  review?: string;
};
