import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/app.ts
import express from "express";

// src/api/api.routes.ts
import { Router as Router8 } from "express";

// src/api/auth/auth.routes.ts
import { Router } from "express";

// src/generated/prisma/enums.ts
var UsersRole = {
  teacher: "teacher",
  admin: "admin",
  student: "student"
};

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/config/config.ts
import "dotenv/config";
var config = {
  port: process.env.PORT || 3e3,
  node_env: process.env.NODE_ENV || "development",
  better_url: process.env.BETTER_AUTH_URL,
  app_url: process.env.app_url,
  smtp_host: process.env.SMTP_HOST,
  smtp_port: Number(process.env.SMTP_PORT),
  smtp_secure: process.env.SMTP_SECURE === "true",
  smtp_user: process.env.SMTP_USER,
  smtp_pass: process.env.SMTP_PASS,
  smtp_from: process.env.SMTP_FROM
};

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum UsersRole {\n  teacher @map("TEACHER")\n  admin   @map("ADMIN")\n  student @map("STUDENT")\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role          UsersRole      @default(student)\n  is_banned     Boolean        @default(false)\n  tutorProfiles TutorProfile[]\n  bookings      Booking[]\n\n  @@unique([email])\n  @@map("users")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Category {\n  id   String @id @unique @default(uuid())\n  name String\n\n  tutors TutorProfile[]\n}\n\nmodel TutorProfile {\n  id             String      @id @unique @default(uuid())\n  user_id        String\n  category_id    String\n  description    String?\n  price_per_hour Int\n  featured       Boolean     @default(false)\n  category       Category    @relation(fields: [category_id], references: [id])\n  userToTutor    User        @relation(fields: [user_id], references: [id])\n  availables     Available[]\n  bookings       Booking[]\n\n  @@map("tutor_profiles")\n}\n\nenum WeekDay {\n  saturday  @map("SATURDAY")\n  sunday    @map("SUNDAY")\n  monday    @map("MONDAY")\n  tuesday   @map("TUESDAY")\n  wednesday @map("WEDNESDAY")\n  thursday  @map("THURSDAY")\n  friday    @map("FRIDAY")\n}\n\nmodel Available {\n  id             String       @id @unique @default(uuid())\n  start_time     DateTime     @db.Time()\n  end_time       DateTime     @db.Time()\n  tutor_id       String\n  day            WeekDay\n  availableTutor TutorProfile @relation(fields: [tutor_id], references: [id])\n\n  @@map("available_days")\n}\n\nenum BookingStatus {\n  confirm   @map("CONFIRM")\n  completed @map("COMPLETED")\n  cancelled @map("CANCELLED")\n}\n\nmodel Booking {\n  id             String        @id @unique @default(uuid())\n  tutor_id       String\n  student_id     String\n  start_time     DateTime      @db.Time()\n  end_time       DateTime      @db.Time()\n  date           DateTime      @db.Time()\n  total_price    Int\n  status         BookingStatus @default(confirm)\n  bookingTutor   TutorProfile  @relation(fields: [tutor_id], references: [id])\n  bookingStudent User          @relation(fields: [student_id], references: [id])\n  ratings        Rating?\n\n  @@map("bookings")\n}\n\nmodel Rating {\n  id            String   @id @unique @default(uuid())\n  booking_id    String   @unique\n  rating        Int      @db.SmallInt\n  review        String?\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n  bookingRating Booking  @relation(fields: [booking_id], references: [id])\n\n  @@map("ratings")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"UsersRole"},{"name":"is_banned","kind":"scalar","type":"Boolean"},{"name":"tutorProfiles","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToUser"}],"dbName":"users"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tutors","kind":"object","type":"TutorProfile","relationName":"CategoryToTutorProfile"}],"dbName":null},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"user_id","kind":"scalar","type":"String"},{"name":"category_id","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price_per_hour","kind":"scalar","type":"Int"},{"name":"featured","kind":"scalar","type":"Boolean"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorProfile"},{"name":"userToTutor","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"availables","kind":"object","type":"Available","relationName":"AvailableToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"}],"dbName":"tutor_profiles"},"Available":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"start_time","kind":"scalar","type":"DateTime"},{"name":"end_time","kind":"scalar","type":"DateTime"},{"name":"tutor_id","kind":"scalar","type":"String"},{"name":"day","kind":"enum","type":"WeekDay"},{"name":"availableTutor","kind":"object","type":"TutorProfile","relationName":"AvailableToTutorProfile"}],"dbName":"available_days"},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutor_id","kind":"scalar","type":"String"},{"name":"student_id","kind":"scalar","type":"String"},{"name":"start_time","kind":"scalar","type":"DateTime"},{"name":"end_time","kind":"scalar","type":"DateTime"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"total_price","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"bookingTutor","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"bookingStudent","kind":"object","type":"User","relationName":"BookingToUser"},{"name":"ratings","kind":"object","type":"Rating","relationName":"BookingToRating"}],"dbName":"bookings"},"Rating":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"booking_id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"review","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookingRating","kind":"object","type":"Booking","relationName":"BookingToRating"}],"dbName":"ratings"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/sendEmail.ts
import nodemailer from "nodemailer";
async function sendEmail({ to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: Number(config.smtp_port) || 587,
    secure: config.smtp_secure,
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass
    }
  });
  const info = await transporter.sendMail({
    from: `"Skill Bridge" <${config.smtp_from}>`,
    to,
    subject,
    text,
    html
  });
  console.log("Email sent: %s", info.messageId);
}

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  advanced: {
    cookiePrefix: "skill_bridge"
  },
  trustedOrigins: [config.app_url, config.better_url],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    minPasswordLength: 6
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationUrl = `${config.app_url}/verify?token=${token}`;
      const html = `
                      <div style="font-family: Arial, sans-serif; text-align: center;">
                        <h2>Welcome to Our App, ${user?.name}!</h2>
                        <p>Please verify your email address to continue.</p>
                        <a href="${verificationUrl}"
                          style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                          Verify Email
                        </a>
                        <p>If you did not create an account, you can ignore this email.</p>
                      </div>
                    `;
      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: "Verify your email address for SkillBridge",
          text: `Click the link to verify your email: ${verificationUrl}`,
          html
        });
      }
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: UsersRole.student
      },
      is_banned: {
        type: "boolean",
        required: false,
        defaultValue: false
      }
    }
  }
});

// src/api/auth/app.service.ts
var registerUser = async ({
  name,
  email,
  password,
  role
}) => {
  return auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role
    },
    asResponse: true
  });
};
var loginUser = async ({ password, email }) => {
  return auth.api.signInEmail({
    body: {
      email,
      password
    },
    asResponse: true
  });
};
var verifyEmail = async (token) => {
  return auth.api.verifyEmail({
    query: {
      token
    },
    asResponse: true
  });
};
var userDetails = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      is_banned: true,
      emailVerified: true,
      createdAt: true
    }
  });
};
var logoutUser = async (headers) => {
  return auth.api.signOut({
    headers,
    asResponse: true
  });
};
var AuthServices = {
  registerUser,
  loginUser,
  verifyEmail,
  userDetails,
  logoutUser
};

// src/lib/AppError.ts
var AppError = class extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/lib/asyncHandler.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
var validate = (schema, source = "body") => (req, res, next) => {
  try {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
      throw new AppError(errors.join(", "), 400);
    }
    req[source] = result.data;
    next();
  } catch (error) {
    next(error);
  }
};

// src/api/auth/auth.controller.ts
var registerUser2 = catchAsync(async (req, res) => {
  const { name, email, password, role = UsersRole.student } = req.body;
  if (role === UsersRole.admin) {
    throw new AppError("Cannot create admin role", 403);
  }
  const result = await AuthServices.registerUser({
    name,
    email,
    password,
    role
  });
  if (!result) {
    throw new AppError("Failed to create user", 400);
  }
  const setCookieHeader = result.headers.get("set-cookie");
  if (setCookieHeader) {
    res.setHeader("Set-Cookie", setCookieHeader);
  }
  const data = await result.json();
  const isSuccess = result.status >= 200 && result.status < 300;
  if (!isSuccess) {
    throw new AppError(
      data?.message || data?.error || "Registration failed",
      result.status
    );
  }
  res.status(201).json({
    success: true,
    message: "User registered successfully. Please verify your email.",
    data
  });
});
var loginUser2 = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { is_banned: true }
  });
  if (existingUser?.is_banned) {
    throw new AppError("Your account has been suspended", 403);
  }
  const result = await AuthServices.loginUser({ password, email });
  if (!result) {
    throw new AppError("Invalid credentials", 401);
  }
  const data = await result.json();
  const isSuccess = result.status >= 200 && result.status < 300;
  if (!isSuccess) {
    throw new AppError(
      data?.message || data?.error || "Invalid email or password",
      result.status
    );
  }
  let sessionToken = data?.token || null;
  if (!sessionToken) {
    const setCookieHeader = result.headers.get("set-cookie");
    if (setCookieHeader) {
      const tokenMatch = setCookieHeader.match(
        /skill_bridge\.session_token=([^;]+)/
      );
      if (tokenMatch) {
        sessionToken = tokenMatch[1];
      }
    }
  }
  if (!sessionToken) {
    throw new AppError("Login succeeded but failed to create session", 500);
  }
  res.status(200).json({
    success: true,
    message: "Login successful",
    data,
    sessionToken
  });
});
var userDetails2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }
  const result = await AuthServices.userDetails(userId);
  if (!result) {
    throw new AppError("User not found", 404);
  }
  res.status(200).json({
    success: true,
    message: "User details retrieved successfully",
    data: result
  });
});
var verifyEmail2 = catchAsync(async (req, res) => {
  const { token } = req.query;
  if (!token || typeof token !== "string") {
    throw new AppError("Verification token is required", 400);
  }
  const result = await AuthServices.verifyEmail(token);
  if (!result) {
    throw new AppError("Failed to verify email", 400);
  }
  const data = await result.json();
  const isSuccess = result.status >= 200 && result.status < 300;
  if (!isSuccess) {
    throw new AppError(
      data?.message || "Email verification failed. The link may have expired.",
      result.status
    );
  }
  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data
  });
});
var logoutUser2 = catchAsync(async (req, res) => {
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (typeof value === "string") {
      headers.set(key, value);
    } else if (Array.isArray(value)) {
      headers.set(key, value.join(", "));
    }
  });
  const result = await AuthServices.logoutUser(headers);
  if (result) {
    const setCookieHeader = result.headers.get("set-cookie");
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }
  }
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});
var AuthControllers = {
  registerUser: registerUser2,
  loginUser: loginUser2,
  userDetails: userDetails2,
  verifyEmail: verifyEmail2,
  logoutUser: logoutUser2
};

// src/middleware/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No valid session found"
        });
      }
      if (!session.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not found"
        });
      }
      if (session.user.is_banned) {
        return res.status(403).json({
          success: false,
          message: "Your account has been suspended"
        });
      }
      if (!session.user.role || !roles.includes(session.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission to access this resource"
        });
      }
      req.user = session.user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: "Authentication failed"
      });
    }
  };
};

// src/lib/validation.ts
import { z } from "zod";
var registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
  role: z.enum(["student", "teacher"], {
    message: "Role must be either student or teacher"
  })
});
var loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});
var createBookingSchema = z.object({
  tutor_id: z.string().min(1, "Tutor ID is required"),
  date: z.string().min(1, "Date is required"),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)")
});
var updateBookingStatusSchema = z.object({
  status: z.enum(["confirm", "completed", "cancelled"], {
    message: "Status must be confirm, completed, or cancelled"
  })
});
var createReviewSchema = z.object({
  booking_id: z.string().min(1, "Booking ID is required"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  review: z.string().optional()
});
var updateTutorProfileSchema = z.object({
  category_id: z.string().min(1, "Category ID is required").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  price_per_hour: z.number().int().positive("Price must be positive").optional()
});
var availabilityEntrySchema = z.object({
  day: z.enum(
    [
      "saturday",
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday"
    ],
    { message: "Invalid day" }
  ),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)")
});
var updateAvailabilitySchema = z.object({
  availability: z.array(availabilityEntrySchema).min(1, "At least one availability slot is required")
});
var createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(100)
});
var updateCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(100)
});
var updateUserStatusSchema = z.object({
  is_banned: z.boolean().optional(),
  role: z.enum(["student", "teacher", "admin"], {
    message: "Invalid role"
  }).optional()
});
var paramIdSchema = z.object({
  id: z.string().min(1, "ID is required")
});

// src/api/auth/auth.routes.ts
var router = Router();
router.post(
  "/register",
  validate(registerSchema),
  AuthControllers.registerUser
);
router.post("/login", validate(loginSchema), AuthControllers.loginUser);
router.post("/logout", AuthControllers.logoutUser);
router.get("/verify-email", AuthControllers.verifyEmail);
router.get(
  "/me",
  auth2(UsersRole.admin, UsersRole.student, UsersRole.teacher),
  AuthControllers.userDetails
);

// src/api/tutors/tutors.route.ts
import { Router as Router2 } from "express";

// src/lib/pagination.ts
var calculatePagination = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  return {
    page,
    limit,
    skip
  };
};
var buildPaginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};
var parseSortOptions = (sortBy, sortOrder, allowedFields = [], defaultSortBy = "createdAt", defaultSortOrder = "desc") => {
  const validatedSortBy = sortBy && allowedFields.includes(sortBy) ? sortBy : defaultSortBy;
  const validatedSortOrder = sortOrder === "asc" || sortOrder === "desc" ? sortOrder : defaultSortOrder;
  return {
    sortBy: validatedSortBy,
    sortOrder: validatedSortOrder
  };
};
var buildPrismaOrderBy = (sortBy, sortOrder) => {
  if (sortBy.includes(".")) {
    const [relation, field] = sortBy.split(".");
    return {
      [relation]: {
        [field]: sortOrder
      }
    };
  }
  return {
    [sortBy]: sortOrder
  };
};

// src/api/tutors/tutors.service.ts
var getTutors = async (query) => {
  const { search, sortBy, sortOrder, category, featured, page, limit } = query;
  const {
    page: currentPage,
    limit: pageLimit,
    skip
  } = calculatePagination({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10
  });
  const sortOptions = parseSortOptions(
    sortBy,
    sortOrder,
    ["name", "email", "createdAt"],
    "createdAt",
    "desc"
  );
  const where = {
    role: "teacher",
    tutorProfiles: {
      some: {}
    }
  };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } }
    ];
  }
  if (category) {
    where.tutorProfiles = {
      some: {
        category_id: category
      }
    };
  }
  if (featured !== void 0) {
    const isFeatured = featured === "true";
    where.tutorProfiles = {
      some: {
        ...where.tutorProfiles?.some || {},
        featured: isFeatured
      }
    };
  }
  let orderBy = [];
  if (featured === void 0) {
    orderBy.push({
      tutorProfiles: {
        _count: "desc"
      }
    });
  }
  if (sortOptions.sortBy === "name" || sortOptions.sortBy === "email") {
    orderBy.push({
      [sortOptions.sortBy]: sortOptions.sortOrder
    });
  } else {
    orderBy.push(buildPrismaOrderBy(sortOptions.sortBy, sortOptions.sortOrder));
  }
  const total = await prisma.user.count({ where });
  const tutors = await prisma.user.findMany({
    where,
    skip,
    take: pageLimit,
    orderBy,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      tutorProfiles: {
        orderBy: featured === void 0 ? { featured: "desc" } : void 0,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });
  let sortedTutors = tutors;
  if (featured === void 0) {
    sortedTutors = tutors.sort((a, b) => {
      const aHasFeatured = a.tutorProfiles.some((p) => p.featured);
      const bHasFeatured = b.tutorProfiles.some((p) => p.featured);
      if (aHasFeatured && !bHasFeatured) return -1;
      if (!aHasFeatured && bHasFeatured) return 1;
      return 0;
    });
  }
  return buildPaginationResponse(sortedTutors, total, currentPage, pageLimit);
};
var getATutor = async (tutorId) => {
  const tutor = await prisma.user.findUnique({
    where: {
      id: tutorId,
      role: "teacher"
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      tutorProfiles: {
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          featured: "desc"
        }
      }
    }
  });
  if (!tutor || tutor.tutorProfiles.length === 0) {
    return null;
  }
  const [mainProfile, ...otherProfiles] = tutor.tutorProfiles;
  return {
    id: tutor.id,
    name: tutor.name,
    email: tutor.email,
    image: tutor.image,
    createdAt: tutor.createdAt,
    mainProfile: mainProfile || null,
    otherProfiles: otherProfiles || []
  };
};
var TutorsServices = {
  getTutors,
  getATutor
};

// src/api/tutors/tutors.controller.ts
var getTutors2 = catchAsync(async (req, res) => {
  const query = {
    search: req.query.search,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
    category: req.query.category,
    featured: req.query.featured,
    page: req.query.page,
    limit: req.query.limit
  };
  const result = await TutorsServices.getTutors(query);
  res.status(200).json({
    success: true,
    message: "Tutors retrieved successfully",
    ...result
  });
});
var getATutor2 = catchAsync(async (req, res) => {
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
    data: tutor
  });
});
var TutorsControllers = {
  getTutors: getTutors2,
  getATutor: getATutor2
};

// src/api/tutors/tutors.route.ts
var router2 = Router2();
router2.get("/", TutorsControllers.getTutors);
router2.get("/:id", TutorsControllers.getATutor);

// src/api/categories/categories.routes.ts
import { Router as Router3 } from "express";

// src/api/categories/categories.service.ts
var getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc"
    }
  });
  return categories;
};
var createCategory = async (name) => {
  const category = await prisma.category.create({
    data: {
      name
    }
  });
  return category;
};
var deleteCategory = async (id) => {
  const category = await prisma.category.delete({
    where: { id }
  });
  return category;
};
var CategoriesService = {
  getAllCategories,
  createCategory,
  deleteCategory
};

// src/api/categories/categories.controller.ts
var getAllCategories2 = catchAsync(async (_req, res) => {
  const categories = await CategoriesService.getAllCategories();
  res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    data: categories
  });
});
var createCategory2 = catchAsync(async (req, res) => {
  const { name } = req.body;
  const category = await CategoriesService.createCategory(name);
  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category
  });
});
var deleteCategory2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  if (!id) throw new AppError("Category ID is required", 400);
  const category = await CategoriesService.deleteCategory(id);
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: category
  });
});
var CategoriesController = {
  getAllCategories: getAllCategories2,
  createCategory: createCategory2,
  deleteCategory: deleteCategory2
};

// src/api/categories/categories.routes.ts
var router3 = Router3();
router3.get("/", CategoriesController.getAllCategories);
router3.post(
  "/",
  auth2(UsersRole.admin),
  validate(createCategorySchema),
  CategoriesController.createCategory
);
router3.delete(
  "/:id",
  auth2(UsersRole.admin),
  CategoriesController.deleteCategory
);

// src/api/bookings/bookings.route.ts
import { Router as Router4 } from "express";

// src/api/bookings/bookings.service.ts
var createBooking = async (data) => {
  const { student_id, tutor_id, start_time, end_time, date } = data;
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutor_id },
    select: { price_per_hour: true }
  });
  if (!tutorProfile) {
    throw new AppError("Tutor not found", 404);
  }
  const startHour = (/* @__PURE__ */ new Date(`1970-01-01T${start_time}`)).getHours();
  const endHour = (/* @__PURE__ */ new Date(`1970-01-01T${end_time}`)).getHours();
  const hours = endHour - startHour;
  const total_price = hours * tutorProfile.price_per_hour;
  const id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const booking = await prisma.booking.create({
    data: {
      id,
      student_id,
      tutor_id,
      start_time: /* @__PURE__ */ new Date(`1970-01-01T${start_time}`),
      end_time: /* @__PURE__ */ new Date(`1970-01-01T${end_time}`),
      date: new Date(date),
      total_price,
      status: "confirm"
    },
    include: {
      bookingTutor: {
        include: {
          userToTutor: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          category: true
        }
      },
      bookingStudent: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  return booking;
};
var getUserBookings = async (userId, userRole, query) => {
  const { page, limit, status } = query;
  const {
    page: currentPage,
    limit: pageLimit,
    skip
  } = calculatePagination({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10
  });
  const where = {};
  if (userRole === "student") {
    where.student_id = userId;
  } else if (userRole === "teacher") {
    where.bookingTutor = {
      user_id: userId
    };
  }
  if (status) {
    where.status = status;
  }
  const [bookings, total] = await prisma.$transaction([
    prisma.booking.findMany({
      where,
      skip,
      take: pageLimit,
      orderBy: {
        date: "desc"
      },
      include: {
        bookingTutor: {
          include: {
            userToTutor: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            },
            category: true
          }
        },
        bookingStudent: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        ratings: true
      }
    }),
    prisma.booking.count({ where })
  ]);
  return buildPaginationResponse(bookings, total, currentPage, pageLimit);
};
var getBookingDetails = async (bookingId, userId, userRole) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      bookingTutor: {
        include: {
          userToTutor: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          category: true,
          availables: true
        }
      },
      bookingStudent: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      ratings: true
    }
  });
  if (!booking) {
    return null;
  }
  if (userRole === "student" && booking.student_id !== userId) {
    throw new AppError("You don't have permission to view this booking", 403);
  }
  if (userRole === "teacher" && booking.bookingTutor.user_id !== userId) {
    throw new AppError("You don't have permission to view this booking", 403);
  }
  return booking;
};
var updateBookingStatus = async (bookingId, userId, userRole, status) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      bookingTutor: true
    }
  });
  if (!booking) {
    throw new AppError("Booking not found", 404);
  }
  if (userRole === "student") {
    if (booking.student_id !== userId) {
      throw new AppError(
        "You don't have permission to update this booking",
        403
      );
    }
    if (status !== "cancelled") {
      throw new AppError("Students can only cancel bookings", 400);
    }
  } else if (userRole === "teacher") {
    if (booking.bookingTutor.user_id !== userId) {
      throw new AppError(
        "You don't have permission to update this booking",
        403
      );
    }
    if (!["completed", "cancelled"].includes(status)) {
      throw new AppError(
        "Tutors can only mark bookings as completed or cancelled",
        400
      );
    }
  }
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: {
      bookingTutor: {
        include: {
          userToTutor: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          category: true
        }
      },
      bookingStudent: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      ratings: true
    }
  });
  return updatedBooking;
};
var BookingsService = {
  createBooking,
  getUserBookings,
  getBookingDetails,
  updateBookingStatus
};

// src/api/bookings/bookings.controller.ts
var createBooking2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  const { tutor_id, start_time, end_time, date } = req.body;
  const booking = await BookingsService.createBooking({
    student_id: userId,
    tutor_id,
    start_time,
    end_time,
    date
  });
  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking
  });
});
var getUserBookings2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  if (!userId) throw new AppError("Unauthorized", 401);
  const query = {
    page: req.query.page,
    limit: req.query.limit,
    status: req.query.status
  };
  const result = await BookingsService.getUserBookings(userId, userRole, query);
  res.status(200).json({
    success: true,
    message: "Bookings retrieved successfully",
    ...result
  });
});
var getBookingDetails2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  const id = req.params.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  if (!id) throw new AppError("Booking ID is required", 400);
  const booking = await BookingsService.getBookingDetails(id, userId, userRole);
  if (!booking) throw new AppError("Booking not found", 404);
  res.status(200).json({
    success: true,
    message: "Booking details retrieved successfully",
    data: booking
  });
});
var updateBookingStatus2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  const id = req.params.id;
  const { status } = req.body;
  if (!userId) throw new AppError("Unauthorized", 401);
  const booking = await BookingsService.updateBookingStatus(
    id,
    userId,
    userRole,
    status
  );
  res.status(200).json({
    success: true,
    message: "Booking status updated successfully",
    data: booking
  });
});
var BookingsController = {
  createBooking: createBooking2,
  getUserBookings: getUserBookings2,
  getBookingDetails: getBookingDetails2,
  updateBookingStatus: updateBookingStatus2
};

// src/api/bookings/bookings.route.ts
var router4 = Router4();
router4.post(
  "/",
  auth2(UsersRole.student),
  validate(createBookingSchema),
  BookingsController.createBooking
);
router4.get(
  "/",
  auth2(UsersRole.student, UsersRole.teacher, UsersRole.admin),
  BookingsController.getUserBookings
);
router4.get(
  "/:id",
  auth2(UsersRole.student, UsersRole.teacher, UsersRole.admin),
  BookingsController.getBookingDetails
);
router4.patch(
  "/:id",
  auth2(UsersRole.student, UsersRole.teacher, UsersRole.admin),
  validate(updateBookingStatusSchema),
  BookingsController.updateBookingStatus
);

// src/api/tutor/tutor.route.ts
import { Router as Router5 } from "express";

// src/api/tutor/tutor.service.ts
var TutorService = class {
  static async getProfile(userId) {
    try {
      const tutorProfile = await prisma.tutorProfile.findFirst({
        where: { user_id: userId },
        include: {
          category: true,
          userToTutor: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          availables: true,
          bookings: {
            include: {
              ratings: true
            }
          }
        }
      });
      if (!tutorProfile) {
        return null;
      }
      const ratings = tutorProfile.bookings.filter((b) => b.ratings).map((b) => b.ratings.rating);
      const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
      return {
        ...tutorProfile,
        averageRating
      };
    } catch (error) {
      console.error("Error in getProfile service:", error);
      throw error;
    }
  }
  static async getSessions(userId) {
    try {
      const tutorProfile = await prisma.tutorProfile.findFirst({
        where: { user_id: userId }
      });
      if (!tutorProfile) {
        const error = new AppError("Tutor profile not found", 404);
        throw error;
      }
      const sessions = await prisma.booking.findMany({
        where: { tutor_id: tutorProfile.id },
        include: {
          bookingStudent: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          bookingTutor: {
            include: {
              category: true,
              userToTutor: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true
                }
              }
            }
          },
          ratings: true
        },
        orderBy: {
          date: "desc"
        }
      });
      return sessions;
    } catch (error) {
      console.error("Error in getSessions service:", error);
      throw error;
    }
  }
  static async updateProfile(userId, data) {
    try {
      let tutorProfile = await prisma.tutorProfile.findFirst({
        where: { user_id: userId }
      });
      if (!tutorProfile) {
        if (!data.category_id || !data.price_per_hour) {
          throw new AppError(
            "category_id and price_per_hour are required to create a tutor profile",
            400
          );
        }
        const category = await prisma.category.findUnique({
          where: { id: data.category_id }
        });
        if (!category) {
          throw new AppError("Category not found", 404);
        }
        tutorProfile = await prisma.tutorProfile.create({
          data: {
            user_id: userId,
            category_id: data.category_id,
            price_per_hour: data.price_per_hour,
            description: data.description || null
          },
          include: {
            category: true,
            userToTutor: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        });
        return tutorProfile;
      }
      if (data.category_id) {
        const category = await prisma.category.findUnique({
          where: { id: data.category_id }
        });
        if (!category) {
          throw new AppError("Category not found", 404);
        }
      }
      const updateData = {};
      if (data.description !== void 0)
        updateData.description = data.description;
      if (data.price_per_hour !== void 0)
        updateData.price_per_hour = data.price_per_hour;
      if (data.category_id !== void 0)
        updateData.category_id = data.category_id;
      const updatedProfile = await prisma.tutorProfile.update({
        where: { id: tutorProfile.id },
        data: updateData,
        include: {
          category: true,
          userToTutor: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      });
      return updatedProfile;
    } catch (error) {
      console.error("Error in updateProfile service:", error);
      throw error;
    }
  }
  static async updateAvailability(userId, availability) {
    try {
      const tutorProfile = await prisma.tutorProfile.findFirst({
        where: { user_id: userId }
      });
      if (!tutorProfile) {
        throw new AppError("Tutor profile not found for this user", 404);
      }
      await prisma.available.deleteMany({
        where: { tutor_id: tutorProfile.id }
      });
      const availabilityData = availability.map((avail) => ({
        tutor_id: tutorProfile.id,
        day: avail.day,
        start_time: /* @__PURE__ */ new Date(`1970-01-01T${avail.start_time}`),
        end_time: /* @__PURE__ */ new Date(`1970-01-01T${avail.end_time}`)
      }));
      const createdAvailability = await prisma.available.createMany({
        data: availabilityData
      });
      const updatedAvailability = await prisma.available.findMany({
        where: { tutor_id: tutorProfile.id }
      });
      return updatedAvailability;
    } catch (error) {
      console.error("Error in updateAvailability service:", error);
      throw error;
    }
  }
};

// src/api/tutor/tutor.controller.ts
var TutorController = class {
  static {
    this.getProfile = catchAsync(async (req, res) => {
      const userId = req.user?.id;
      if (!userId) throw new AppError("User not authenticated", 401);
      const profile = await TutorService.getProfile(userId);
      if (!profile) {
        throw new AppError(
          "Tutor profile not found. Please create one first.",
          404
        );
      }
      res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: profile
      });
    });
  }
  static {
    this.getSessions = catchAsync(async (req, res) => {
      const userId = req.user?.id;
      if (!userId) throw new AppError("User not authenticated", 401);
      const sessions = await TutorService.getSessions(userId);
      res.status(200).json({
        success: true,
        message: "Sessions retrieved successfully",
        data: sessions
      });
    });
  }
  static {
    this.updateProfile = catchAsync(async (req, res) => {
      const userId = req.user?.id;
      if (!userId) throw new AppError("User not authenticated", 401);
      const { description, price_per_hour, category_id } = req.body;
      if (!description && !price_per_hour && !category_id) {
        throw new AppError("At least one field is required to update", 400);
      }
      const updatedProfile = await TutorService.updateProfile(userId, {
        description,
        price_per_hour,
        category_id
      });
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile
      });
    });
  }
  static {
    this.updateAvailability = catchAsync(
      async (req, res) => {
        const userId = req.user?.id;
        if (!userId) throw new AppError("User not authenticated", 401);
        const { availability } = req.body;
        const updatedAvailability = await TutorService.updateAvailability(
          userId,
          availability
        );
        res.status(200).json({
          success: true,
          message: "Availability updated successfully",
          data: updatedAvailability
        });
      }
    );
  }
};

// src/api/tutor/tutor.route.ts
var router5 = Router5();
router5.get("/profile", auth2(UsersRole.teacher), TutorController.getProfile);
router5.put(
  "/profile",
  auth2(UsersRole.teacher),
  validate(updateTutorProfileSchema),
  TutorController.updateProfile
);
router5.get("/sessions", auth2(UsersRole.teacher), TutorController.getSessions);
router5.put(
  "/availability",
  auth2(UsersRole.teacher),
  validate(updateAvailabilitySchema),
  TutorController.updateAvailability
);

// src/api/reviews/reviews.routes.ts
import { Router as Router6 } from "express";

// src/api/reviews/reviews.service.ts
var ReviewsService = class {
  static async createReview(studentId, data) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: data.booking_id },
        include: {
          ratings: true
        }
      });
      if (!booking) {
        throw new AppError("Booking not found", 404);
      }
      if (booking.student_id !== studentId) {
        throw new AppError("You can only review your own bookings", 403);
      }
      if (booking.status !== "completed") {
        throw new AppError("You can only review completed bookings", 400);
      }
      if (booking.ratings) {
        throw new AppError("A review already exists for this booking", 409);
      }
      const createdReview = await prisma.rating.create({
        data: {
          booking_id: data.booking_id,
          rating: data.rating,
          review: data.review
        },
        include: {
          bookingRating: {
            include: {
              bookingTutor: {
                include: {
                  userToTutor: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      image: true
                    }
                  },
                  category: true
                }
              }
            }
          }
        }
      });
      return createdReview;
    } catch (error) {
      console.error("Error in createReview service:", error);
      throw error;
    }
  }
};

// src/api/reviews/reviews.controller.ts
var ReviewsController = class {
  static {
    this.createReview = catchAsync(async (req, res) => {
      const studentId = req.user?.id;
      if (!studentId) throw new AppError("User not authenticated", 401);
      const { booking_id, rating, review } = req.body;
      const createdReview = await ReviewsService.createReview(studentId, {
        booking_id,
        rating,
        review
      });
      res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: createdReview
      });
    });
  }
};

// src/api/reviews/reviews.routes.ts
var router6 = Router6();
router6.post(
  "/",
  auth2(UsersRole.student),
  validate(createReviewSchema),
  ReviewsController.createReview
);

// src/api/admin/admin.routes.ts
import { Router as Router7 } from "express";

// src/api/admin/admin.service.ts
var AdminService = class {
  static async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          is_banned: true,
          createdAt: true,
          updatedAt: true,
          tutorProfiles: {
            select: {
              id: true,
              category_id: true,
              description: true,
              price_per_hour: true,
              featured: true
            }
          },
          bookings: {
            select: {
              id: true,
              status: true,
              total_price: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      return users;
    } catch (error) {
      console.error("Error in getAllUsers service:", error);
      throw error;
    }
  }
  static async getAllBookings() {
    try {
      const bookings = await prisma.booking.findMany({
        include: {
          bookingStudent: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          bookingTutor: {
            include: {
              category: true,
              userToTutor: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true
                }
              }
            }
          },
          ratings: true
        },
        orderBy: {
          date: "desc"
        }
      });
      return bookings;
    } catch (error) {
      console.error("Error in getAllBookings service:", error);
      throw error;
    }
  }
  static async updateUserStatus(userId, data) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new AppError("User not found", 404);
      }
      const updateData = {};
      if (data.is_banned !== void 0) updateData.is_banned = data.is_banned;
      if (data.role !== void 0) updateData.role = data.role;
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          is_banned: true,
          createdAt: true,
          updatedAt: true
        }
      });
      return updatedUser;
    } catch (error) {
      console.error("Error in updateUserStatus service:", error);
      throw error;
    }
  }
};

// src/api/admin/admin.controller.ts
var AdminController = class {
  static {
    this.getAllUsers = catchAsync(async (_req, res) => {
      const users = await AdminService.getAllUsers();
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users
      });
    });
  }
  static {
    this.getAllBookings = catchAsync(async (_req, res) => {
      const bookings = await AdminService.getAllBookings();
      res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: bookings
      });
    });
  }
  static {
    this.updateUserStatus = catchAsync(async (req, res) => {
      const id = req.params.id;
      const { is_banned, role } = req.body;
      if (is_banned === void 0 && !role) {
        throw new AppError(
          "At least one field (is_banned or role) is required",
          400
        );
      }
      const updatedUser = await AdminService.updateUserStatus(id, {
        is_banned,
        role
      });
      res.status(200).json({
        success: true,
        message: "User status updated successfully",
        data: updatedUser
      });
    });
  }
};

// src/api/admin/admin.routes.ts
var router7 = Router7();
router7.get("/users", auth2(UsersRole.admin), AdminController.getAllUsers);
router7.get("/bookings", auth2(UsersRole.admin), AdminController.getAllBookings);
router7.patch(
  "/users/:id",
  auth2(UsersRole.admin),
  validate(updateUserStatusSchema),
  AdminController.updateUserStatus
);

// src/api/api.routes.ts
var router8 = Router8();
router8.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    environment: process.env.NODE_ENV
  });
});
router8.use("/auth", router);
router8.use("/tutors", router2);
router8.use("/tutor", router5);
router8.use("/categories", router3);
router8.use("/bookings", router4);
router8.use("/reviews", router6);
router8.use("/admin", router7);

// src/app.ts
import cors from "cors";

// src/middleware/errorHandler.ts
import { ZodError } from "zod";
var errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors;
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = err.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
  }
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  if (err.code === "P2002") {
    statusCode = 409;
    const target = err.meta?.target;
    message = `Duplicate value for ${Array.isArray(target) ? target.join(", ") : target || "field"}`;
  }
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }
  if (err.code === "P2003") {
    statusCode = 400;
    message = "Invalid reference: related record not found";
  }
  res.status(statusCode).json({
    success: false,
    message,
    ...errors && { errors },
    ...process.env.NODE_ENV === "development" && { stack: err.stack }
  });
};
var notFoundHandler = (req, res, _next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
};

// src/app.ts
var app = express();
var allowedOrigins = [];
if (config.app_url) allowedOrigins.push(config.app_url);
if (config.better_url && config.better_url !== config.app_url) {
  allowedOrigins.push(config.better_url);
}
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true
  })
);
app.use(express.json());
app.use("/api", router8);
app.get("/", (req, res) => {
  res.status(200).json({ message: "The skill bridge is running ok" });
});
app.use(notFoundHandler);
app.use(errorHandler);
var app_default = app;
export {
  app_default as default
};
