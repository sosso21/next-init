import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function debug() {
  console.log("debug");
}
debug();
