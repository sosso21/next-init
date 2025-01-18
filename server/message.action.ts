"use server";
import { $Enums, Prisma } from "@prisma/client";

import { contactFormSchema } from "@/app/[locale]/dashboard/contact-us/types";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { kv } from "@vercel/kv";
import { createServerActionProcedure } from "zsa";
import { auth } from "@/auth";
import { headers, cookies } from "next/headers";
import { Logger } from "tslog";
import {
  sendMessageInputSchema,
  ThreadOutputSchema,
  ThreadsOutputSchema,
} from "@/app/[locale]/dashboard/messages/types";

const logger = new Logger({ name: "message" });

const AdminRequestProvider = createServerActionProcedure()
  .handler(async ({ input, ctx }) => {
    const session = await auth();
    const { role } = session?.user as any;

    if (!(role as $Enums.role[]).includes($Enums.role.ADMIN)) {
      throw new Error("UNAUTHORIZED");
    }

    const reqHeaders = headers();
    return {
      ...session,
      cookies: JSON.stringify(cookies().getAll()),
      ip: reqHeaders.get("x-forwarded-for") as string,
      userAgent: reqHeaders.get("user-agent"),
      xAppVersion: reqHeaders.get("sec-ch-ua"),
    };
  })
  .createServerAction()
  .onComplete((res) => {
    if (res.isError) logger.error(res.error);
    if (res.status && res.status === "success") {
      logger.info("success");
    }
  });

const userRequestProvider = createServerActionProcedure()
  .handler(async ({ input, ctx }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("UNAUTHORIZED");
    }

    const reqHeaders = headers();
    const IP_Address = reqHeaders.get("x-forwarded-for");
    const key = `REQUEST_MESSAGE_${
      process.env.PROJECT_NAME ?? ""
    }_${IP_Address}`;

    if (process.env.NODE_ENV == "production") {
      const kv_ip = ((await kv.get(key)) ?? 0) as number;

      await kv.set(key, `${(kv_ip ?? 0) + 1}`, {
        ex: +(process.env.MESSAGE_REQUEST_TTS_TIME ?? 10),
      });

      if (
        kv_ip &&
        kv_ip >= ((process.env.MESSAGE_REQUEST_RATE_COUNT ?? 10) as number)
      ) {
        throw new Error("RATE_LIMIT");
      }
    }

    return {
      ...session,
      cookies: JSON.stringify(cookies().getAll()),
      ip: reqHeaders.get("x-forwarded-for") as string,
      userAgent: reqHeaders.get("user-agent"),
      xAppVersion: reqHeaders.get("sec-ch-ua"),
    };
  })
  .createServerAction()
  .onComplete((res) => {
    if (res.isError) logger.error(res.error);
    if (res.status && res.status === "success") {
      logger.info("success");
    }
  });

export const MessageCreate = userRequestProvider
  .input(contactFormSchema)
  .output(z.promise(z.boolean()))
  .handler(async ({ input, ctx }) => {
    const userID: string = (ctx?.user as any)?.id ?? "";

    try {
      const thread = await prisma.thread.findFirst({
        where: {
          users: {
            some: {
              id: userID,
            },
          },
          participantRole: {
            equals: [$Enums.role.ADMIN],
          },
        },
        select: {
          id: true,
        },
      });

      if (!thread?.id) {
        await prisma.thread.create({
          data: {
            lastMessageAt: new Date(),
            participantRole: [$Enums.role.ADMIN],
            users: {
              connect: {
                id: userID,
              },
            },
            messages: {
              create: {
                subject: input.subject as $Enums.contactSubject,
                body: input.body,
                sender: {
                  connect: {
                    id: userID,
                  },
                },
                fromContactForm: true,
                ip: ctx.ip,
                cookies: ctx.cookies,
                userAgent: ctx.userAgent,
                xAppVersion: ctx.xAppVersion,
              },
            },
          },
          select: {
            id: true,
          },
        });
      } else {
        await prisma.thread.update({
          where: {
            id: thread.id,
          },
          data: {
            lastMessageAt: new Date(),
            messages: {
              create: {
                subject: input.subject as $Enums.contactSubject,
                body: input.body,
                sender: {
                  connect: {
                    id: userID,
                  },
                },
                fromContactForm: true,
                ip: ctx.ip,
                cookies: ctx.cookies,
                userAgent: ctx.userAgent,
                xAppVersion: ctx.xAppVersion,
              },
            },
          },
        });
      }

      return true;
    } catch (error) {
      throw new Error("ERROR_CREATING_MESSAGE");
    }
  });

export const getThreads = userRequestProvider
  .input(
    z.object({
      take: z.number().max(100).default(10),
      skip: z.number().default(0),
    })
  )
  .output(z.promise(ThreadsOutputSchema))
  .handler(async ({ input, ctx }) => {
    const isAdmin = !!((ctx?.user as any)?.role ?? []).includes(
      $Enums.role.ADMIN
    );

    const ThreadCondition = isAdmin
      ? {
          participantRole: {
            equals: [$Enums.role.ADMIN],
          },
        }
      : {
          users: {
            some: {
              id: ctx.user?.id,
            },
          },
        };
    const threads = await prisma.thread.findMany({
      where: ThreadCondition,
      select: {
        id: true,
        messages: {
          select: {
            id: true,
            body: true,
            createdAt: true,
            readAt: true,
            threadId: true,
            senderId: true,
            sender: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            subject: true,
            senderRole: true,
            fromContactForm: true,
            ip: isAdmin,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        users: {
          select: {
            id: true,
            email: true,
            phones: true,
            name: true,
            username: true,
            image: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
          where: {
            // id: { not: ctx.user?.id },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        participantRole: true,
        lastMessageAt: true,
        createdAt: true,
        updatedAt: true,
      },
      take: input.take as number,
      skip: input.skip as number,
      orderBy: {
        lastMessageAt: "desc",
      },
    });

    const count = await prisma.thread.count({
      where: ThreadCondition,
    });

    return {
      count,
      skip: input.skip,
      take: threads.length,
      hasPreviousPage: input.skip > 0,
      hasNextPage: input.skip + input.take < count,
      data: threads,
      userId: ctx.user?.id ?? "",
      roles: (ctx?.user as any)?.role,
    };
  });

export const getThread = userRequestProvider
  .input(
    z.object({
      id: z.number(),
      take: z.number().max(100).default(10),
      skip: z.number().default(0),
    })
  )
  .output(z.promise(ThreadOutputSchema.nullable()))
  .handler(async ({ input, ctx }) => {
    const userID: string = (ctx?.user as any)?.id ?? "";
    const isAdmin = !!((ctx?.user as any)?.role ?? []).includes(
      $Enums.role.ADMIN
    );

    try {
      if (input.skip === 0) {
        const rededCondition: Prisma.MessageWhereInput = {
          threadId: input.id,
          readAt: null,
        };
        if (!isAdmin) {
          rededCondition.senderRole = {
            not: $Enums.role.ADMIN,
          };
        } else {
          rededCondition.senderId = {
            not: userID,
          };
        }
        await prisma.message.updateMany({
          where: rededCondition,
          data: {
            readAt: new Date(),
          },
        });
      }

      const conditionThread: Prisma.ThreadWhereUniqueInput = {
        id: input.id,
      };

      if (!isAdmin) {
        conditionThread.users = {
          some: {
            id: userID,
          },
        };
      } else {
        conditionThread.participantRole = {
          equals: [$Enums.role.ADMIN],
        };
      }

      const thread = await prisma.thread.findUniqueOrThrow({
        where: conditionThread,

        select: {
          id: true,
          messages: {
            select: {
              id: true,
              body: true,
              createdAt: true,
              readAt: true,
              threadId: true,
              senderId: true,

              sender: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
              subject: true,
              senderRole: true,
              fromContactForm: true,
              ip: isAdmin,
            },
            take: input.take,
            skip: input.skip,
            orderBy: {
              createdAt: "desc",
            },
          },
          users: {
            select: {
              id: true,
              email: true,
              phones: true,
              name: true,
              username: true,
              image: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
            where: {
              // id: { not: ctx.user?.id },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
          participantRole: true,
          lastMessageAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!thread) {
        throw new Error("THREAD_NOT_FOUND");
      }
      const count = await prisma.message.count({
        where: {
          threadId: thread.id,
        },
      });

      return {
        count,
        skip: input.skip,
        take: thread.messages.length,
        hasPreviousPage: input.skip > 0,
        hasNextPage: input.skip + input.take < count,
        data: thread,
        userId: ctx.user?.id ?? "",
        roles: (ctx?.user as any)?.role,
      };
    } catch (error) {
      throw new Error("ERROR_CREATING_MESSAGE");
    }
  });

export const sendMessage = userRequestProvider
  .input(sendMessageInputSchema)
  .output(z.promise(z.boolean()))
  .handler(async ({ input, ctx }) => {
    const userID: string = (ctx?.user as any)?.id ?? "";
    const isAdmin = !!((ctx?.user as any)?.role ?? []).includes(
      $Enums.role.ADMIN
    );
    const conditionThread: Prisma.ThreadWhereUniqueInput = {
      id: input.threadId,
    };
    if (!isAdmin) {
      conditionThread.users = {
        some: {
          id: userID,
        },
      };
    }

    try {
      const thread = await prisma.thread.update({
        where: conditionThread,
        select: {
          id: true,
        },
        data: {
          lastMessageAt: new Date(),
        },
      });
      if (!thread?.id) {
        throw new Error("THREAD_NOT_FOUND");
      }

      const message = await prisma.message.create({
        data: {
          body: input.body,
          threadId: input.threadId,
          senderId: userID,
          senderRole: isAdmin ? $Enums.role.ADMIN : null,
          ip: ctx.ip,
          cookies: ctx.cookies,
          userAgent: ctx.userAgent,
          xAppVersion: ctx.xAppVersion,
        },
      });

      return true;
    } catch (error) {
      throw new Error("ERROR_CREATING_MESSAGE");
    }
  });
