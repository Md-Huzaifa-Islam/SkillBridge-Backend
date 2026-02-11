import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128),
  role: z.enum(["student", "teacher"], {
    message: "Role must be either student or teacher",
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createBookingSchema = z.object({
  tutor_id: z.string().min(1, "Tutor ID is required"),
  date: z.string().min(1, "Date is required"),
  start_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  end_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["confirm", "completed", "cancelled"], {
    message: "Status must be confirm, completed, or cancelled",
  }),
});

export const createReviewSchema = z.object({
  booking_id: z.string().min(1, "Booking ID is required"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  review: z.string().optional(),
});

export const updateTutorProfileSchema = z.object({
  category_id: z.string().min(1, "Category ID is required").optional(),
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

const availabilityEntrySchema = z.object({
  day: z.enum(
    [
      "saturday",
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ],
    { message: "Invalid day" },
  ),
  start_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  end_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
});

export const updateAvailabilitySchema = z.object({
  availability: z
    .array(availabilityEntrySchema)
    .min(1, "At least one availability slot is required"),
});

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100),
});

export const updateUserStatusSchema = z.object({
  is_banned: z.boolean().optional(),
  role: z
    .enum(["student", "teacher", "admin"], {
      message: "Invalid role",
    })
    .optional(),
});

export const paramIdSchema = z.object({
  id: z.string().min(1, "ID is required"),
});
