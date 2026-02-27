import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";
import { randomUUID } from "crypto";
import { UserRole, UserStatus } from "../../../../generated/prisma/enums";
import { sendMail } from "../../../handlers/sendMailHandlers";
import { verifyHtmlGenerate } from "../../../templates/htmlTemplate";
import { config } from "../../../config/config";
const JWT_SECRET = config.jwt_secret;
const JWT_EXPIRES_IN = "7d";

const register = async (req: Request, res: Response) => {
  let { name, email, password, role } = req.body;
  if (!role) role = UserRole.student;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return res.status(409).json({ message: "Email already registered" });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      name,
      email,
      role,
      status: UserStatus.active,
      emailVerified: false,
      password: hash,
    },
  });
  // Generate verification token
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });
  const html = verifyHtmlGenerate(
    `${process.env.APP_URL || "http://localhost:3000"}/verify?token=${token}`,
  );
  await sendMail(
    user.email,
    "Verify your SkillBridge account",
    html,
    `Verify: ${token}`,
  );
  return res
    .status(201)
    .json({ message: "Registered. Please verify your email." });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  if (!user.emailVerified)
    return res.status(403).json({ message: "Email not verified" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });
  if (user.status !== "active")
    return res.status(403).json({ message: "User is banned" });
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
  return res.json({ token, role: user.role });
};

const me = async (req: Request, res: Response) => {
  // @ts-ignore
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  // @ts-ignore
  const { password: _pw, ...safeUser } = req.user as any;
  return res.json({ user: safeUser });
};

const updateMe = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const { name } = req.body;
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res
      .status(400)
      .json({ message: "Name must be at least 2 characters." });
  }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { name: name.trim() },
    select: { id: true, name: true, email: true, role: true },
  });
  return res.json({ user: updated });
};

const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(400).json({ message: "Invalid token" });
    if (user.emailVerified) return res.json({ message: "Already verified" });
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });
    return res.json({ message: "Email verified" });
  } catch {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const AuthControllers = { register, login, me, updateMe, verifyEmail };
