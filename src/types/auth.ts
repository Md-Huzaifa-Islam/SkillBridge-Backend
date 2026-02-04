import { UsersRole } from "../generated/prisma/enums";

export type RegisterParams = {
  name: string;
  email: string;
  password: string;
  role: UsersRole;
};

export type LoginParams = {
  email: string;
  password: string;
};
