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
    const result = await AuthServices.userDetails(req.user?.id!);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to login",
    });
  }
};

export const AuthControllers = {
  registerUser,
  loginUser,
  userDetails,
};
