import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2),
});

export const bookingSchema = z.object({
  tutor_profile_id: z.string(),
  available_id: z.string(),
  date_str: z.string(),
  start_time: z.string(),
  end_time: z.string(),
});

export const reviewSchema = z.object({
  review: z.string().optional(),
  rating: z.number().min(1).max(5),
});

export const reviewUpdateSchema = reviewSchema.partial();

export const tutorProfileSchema = z.object({
  categoryId: z.string(),
  end_time: z.string(),
  pricePerHour: z.number().min(1),
  start_time: z.string(),
  title: z.string().min(2),
  description: z.string().optional(),
});

export const tutorProfileUpdateSchema = tutorProfileSchema.partial();
