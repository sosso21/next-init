"use server";
import { AuthProviderSchema, AuthProviderEnum } from "./type";
import { auth, signIn } from "@/auth";
import { cookies, headers } from "next/headers";
import { kv } from "@vercel/kv";

import { z } from "zod";
import { createServerActionProcedure } from "zsa";

import { prisma } from "@/lib/prisma";
import { Logger } from "tslog";

const magicLinkRequestProvider = createServerActionProcedure()
  .handler(async ({ input }) => {
    const reqHeaders = headers();
    const IP_Address = (await reqHeaders).get("x-forwarded-for");
    const key = `MAGIC8LIN_REQUEST_${
      process.env.PROJECT_NAME ?? ""
    }_${IP_Address}`;

    if (process.env.NODE_ENV == "production") {
      const kv_ip = ((await kv.get(key)) ?? 0) as number;
      await kv.set(key, `${(kv_ip ?? 0) + 1}`, {
        ex: +(process.env.MAGIC_LINK_TTS_TIME ?? 10),
      });

      if (
        kv_ip &&
        kv_ip >= ((process.env.MAGIC_LINK_RATE_COUNT ?? 10) as number)
      ) {
        throw new Error("RATE_LIMIT");
      }
    }
  })
  .createServerAction()
  .onComplete(async (res) => {
    const logger = new Logger({ name: "request" });
    if (res.isError) console.error(res.error);
    if (res.status && res.status === "success") {
      logger.info("success");
    }
  });

export const signInWithProvider = async (provider: AuthProviderEnum) => {
  AuthProviderSchema.parse(provider);
  await signIn(provider);
};

export const signInWithMagicLink = magicLinkRequestProvider
  .input(z.custom<FormData>())
  .output(z.promise(z.void()))
  .handler(async ({ input: formData }) => {
    await signIn("resend", formData);
  });

export async function sayHello(screen: { width: number; height: number }) {
  const reqHeaders = headers();

  const session = await auth();
  const data = {
    userId: session?.user?.id,
    screenWidth: screen.width,
    screenHeight: screen.height,
    cookies: JSON.stringify((await cookies()).getAll()),
    ip: (await reqHeaders).get("x-forwarded-for") as string,
    userAgent: (await reqHeaders).get("user-agent"),
    xAppVersion: (await reqHeaders).get("sec-ch-ua"),
  };

  const key = `PING__${process.env.PROJECT_NAME ?? ""}_${data.ip}`;
  const kv_ip = await kv.get(key);

  await kv.set(key, "OK", {
    ex: +(process.env.PING_TTS_TIME ?? 10),
  });

  if (!kv_ip && process.env.NODE_ENV === "production") {
    await prisma.log.create({ data: data });
  }
  return "OK";
}
