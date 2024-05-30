import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.DEBUG_MODE == 'true' ? ['query'] : [],
  });

if (process.env.NODE_ENV != 'production') globalForPrisma.prisma;
