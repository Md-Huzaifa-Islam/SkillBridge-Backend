import { Request, Response } from "express";
import { UsersRole } from "../../generated/prisma/enums";
import { AuthServices } from "./app.service";

/**
 * Register a new user (student or tutor)
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = UsersRole.student } = req.body;

    if (role === UsersRole.admin) {
      return res
        .status(403)
        .json({ success: false, message: "Can not create admin role" });
    }

    // Create user using better-auth
    const result = await AuthServices.registerUser({
      name,
      email,
      password,
      role,
    });

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Failed to create user",
      });
    }

    // Copy cookies from better-auth Response to Express response
    const setCookieHeader = result.headers.get("set-cookie");
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    const data = await result.json();

    // Check if registration was successful based on HTTP status
    const isSuccess = result.status >= 200 && result.status < 300;

    if (!isSuccess) {
      return res.status(result.status).json({
        success: false,
        message: data?.message || data?.error || "Registration failed",
        error: data?.error,
      });
    }

    return res.status(result.status).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to register user",
    });
  }
};

/**
 * Login user and return session
 * @route POST /api/auth/login
 * @access Public
 */
const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await AuthServices.loginUser({ password, email });

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Copy cookies from better-auth Response to Express response
    const setCookieHeader = result.headers.get("set-cookie");
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    const data = await result.json();

    // Check if login was successful based on HTTP status
    const isSuccess = result.status >= 200 && result.status < 300;

    if (!isSuccess) {
      return res.status(result.status).json({
        success: false,
        message: data?.message || data?.error || "Invalid email or password",
        error: data?.error,
      });
    }

    return res.status(result.status).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to login",
    });
  }
};

const userDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await AuthServices.userDetails(userId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to get user details",
    });
  }
};

/**
 * Verify user email with token
 * @route GET /api/auth/verify-email
 * @access Public
 */
const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const result = await AuthServices.verifyEmail(token);

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Failed to verify email",
      });
    }

    const data = await result.json();

    // Check if verification was successful based on HTTP status
    const isSuccess = result.status >= 200 && result.status < 300;

    if (!isSuccess) {
      return res.status(result.status).json({
        success: false,
        message:
          data?.message ||
          data?.error ||
          "Email verification failed. The link may have expired.",
        error: data?.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to verify email",
    });
  }
};

export const AuthControllers = {
  registerUser,
  loginUser,
  userDetails,
  verifyEmail,
};
