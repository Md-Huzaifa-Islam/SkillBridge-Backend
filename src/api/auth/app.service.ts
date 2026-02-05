import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { LoginParams, RegisterParams } from "../../types/auth";

const registerUser = async ({
  name,
  email,
  password,
  role,
}: RegisterParams) => {
  return auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role,
    },
    asResponse: true,
  });
};

const loginUser = async ({ password, email }: LoginParams) => {
  return auth.api.signInEmail({
    body: {
      email,
      password,
    },
    asResponse: true,
  });
};

const verifyEmail = async (token: string) => {
  return auth.api.verifyEmail({
    query: {
      token,
    },
    asResponse: true,
  });
};

const userDetails = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const AuthServices = {
  registerUser,
  loginUser,
  verifyEmail,
  userDetails,
};
