import { betterAuth, keyof } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { config } from "../config/config";
import { sendMail } from "../handlers/sendMailHandlers";
import { verifyHtmlGenerate } from "../templates/htmlTemplate";
import { UserRole, UserStatus } from "../../generated/prisma/enums";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [config.app_url!],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 50,
  },
  emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail(data, request?) {
      try {
        const baseUrl = config.app_url;
        const verificationUrl = `${baseUrl}/verify?token=${data.token}`;

        const html = verifyHtmlGenerate(verificationUrl);
        const text = `Verify your email: ${verificationUrl}`;

        await sendMail(
          data.user.email,
          "Verify your Skill Bridge account",
          html,
          text,
        );
      } catch (error) {
        console.error("Failed to send verification email:", error);
      }
    },
  },
  user: {
    additionalFields: {
      status: {
        type: "string",
        required: false,
        defaultValue: UserStatus.active,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: UserRole.student,
      },
    },
  },
});
