"use server";
import { parseAsInteger } from "nuqs";
import { AuthProviderSchema, AuthProviderEnum } from "./type";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import { kv } from "@vercel/kv";

export const signInWithProvider = async (provider: AuthProviderEnum) => {
  AuthProviderSchema.parse(provider);
  await signIn(provider);
};

export async function sayHello() {
  const reqHeaders = headers();

  const data = {
    ip: reqHeaders.get("x-forwarded-for") as string,
    userAgent: reqHeaders.get("user-agent"),
    xAppVersion: reqHeaders.get("sec-ch-ua"),
  };

  const key = `${process.env.PROJECT_NAME ?? ""}_${data.ip}`;
  const kv_ip = await kv.get(key);

  await kv.set(key, "OK", {
    ex: +(process.env.TTS_TIME as string) ?? 10,
  });

  if (!kv_ip && process.env.NODE_ENV == "production") {
    //  await prisma.log.create({  data: data, });
  }

  return "OK";
}
