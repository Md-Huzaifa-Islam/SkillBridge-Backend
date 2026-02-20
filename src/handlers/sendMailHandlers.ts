import nodemailer from "nodemailer";
import { config } from "../config/config";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.smtp_user,
    pass: config.smtp_password,
  },
});

export const sendMail = async (
  to: string,
  subject: string,
  html?: string,
  text?: string,
) => {
  try {
    const result = await transporter.sendMail({
      from: `"SkillBridge" <${config.smtp_user}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("send email successfull");
    return {
      success: true,
      message: "Email sent successfully",
      data: null,
    };
  } catch (error: any) {
    console.error("email send error", error);
    throw new Error("Failed to send email");
  }
};
