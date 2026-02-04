import { z } from "zod";

// Auth validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "teacher"], {
    message: "Role must be either student or teacher",
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Booking validation schemas
export const createBookingSchema = z.object({
  tutor_id: z.string().uuid("Invalid tutor ID"),
  date: z.string().datetime("Invalid date format"),
  start_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  end_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
});

// Review validation schemas
export const createReviewSchema = z.object({
  booking_id: z.string().uuid("Invalid booking ID"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  review: z.string().optional(),
});

// Tutor profile validation schemas
export const updateTutorProfileSchema = z.object({
  category_id: z.string().uuid("Invalid category ID").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  price_per_hour: z
    .number()
    .int()
    .positive("Price must be positive")
    .optional(),
});

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
});
