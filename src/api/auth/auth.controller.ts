import { Request, Response } from "express";
import { UsersRole } from "../../generated/prisma/enums";
import { AuthServices } from "./app.service";
import { catchAsync } from "../../lib/asyncHandler";
import { AppError } from "../../lib/AppError";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role = UsersRole.student } = req.body;

  if (role === UsersRole.admin) {
    throw new AppError("Cannot create admin role", 403);
  }

  const result = await AuthServices.registerUser({
    name,
    email,
    password,
    role,
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
      result.status,
    );
  }

  res.status(201).json({
    success: true,
    message: "User registered successfully. Please verify your email.",
    data,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await AuthServices.loginUser({ password, email });

  if (!result) {
    throw new AppError("Invalid credentials", 401);
  }

  const setCookieHeader = result.headers.get("set-cookie");
  if (setCookieHeader) {
    res.setHeader("Set-Cookie", setCookieHeader);
  }

  const data = await result.json();
  const isSuccess = result.status >= 200 && result.status < 300;

  if (!isSuccess) {
    throw new AppError(
      data?.message || data?.error || "Invalid email or password",
      result.status,
    );
  }

  let sessionToken = null;
  if (setCookieHeader) {
    const tokenMatch = setCookieHeader.match(
      /skill_bridge\.session_token=([^;]+)/,
    );
    if (tokenMatch) {
      sessionToken = tokenMatch[1];
    }
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    data,
    sessionToken,
  });
});

const userDetails = catchAsync(async (req: Request, res: Response) => {
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
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
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
      result.status,
    );
  }

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data,
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
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
    message: "Logged out successfully",
  });
});

export const AuthControllers = {
  registerUser,
  loginUser,
  userDetails,
  verifyEmail,
  logoutUser,
};
