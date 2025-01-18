import { cookies } from "next/headers";
import Facebook from "next-auth/providers/facebook";
import google from "next-auth/providers/google";
import github from "next-auth/providers/github";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Resend from "next-auth/providers/resend";
import { CustomSendVerificationRequest } from "./lib/authSendRequest";
import { Lang } from "./lib/use-translation/types";
import { cookieName } from "./middleware";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    github,
    google,
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "no-reply@resend.dev",
      sendVerificationRequest: async (props) => {
        const locale = cookies().get(cookieName)?.value;
        await CustomSendVerificationRequest({
          ...props,
          locale: locale as Lang,
        });
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      const locale =
        new URL(url).pathname.split("/")[1] || process.env.DEFAULT_LANGUAGE;

      return `${baseUrl}/${locale}/dashboard`;
    },
  },
});
