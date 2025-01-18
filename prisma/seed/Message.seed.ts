import { $Enums, PrismaClient } from "@prisma/client";
import casual from "casual";
import { Logger } from "tslog";

const prisma = new PrismaClient();

const logger = new Logger({ name: "message" });

export async function messageSeeder(seedCount = 50) {
  await prisma.thread.deleteMany({ where: { id: { not: 0 } } });
  await prisma.message.deleteMany({ where: { id: { not: 0 } } });

  const exampleBody = [
    casual.sentence,
    casual.full_name,
    casual.word,
    casual.random_element([
      "Developer",
      "Designer",
      "Teacher",
      "Doctor",
      "Engineer",
    ]) as string,
    casual.email,
    casual.string,
    casual.text,
    casual.words(1),
    casual.sentences(1),
    casual.sentences(3),
    casual.words(3),
    casual.sentences(1),
  ];

  const userMessage: {
    subject?: $Enums.contactSubject | undefined;
    body: string;
  }[] = [];
  Object.values($Enums.contactSubject).forEach((subject) => {
    userMessage.push({
      subject: subject as $Enums.contactSubject,
      body: exampleBody[Math.floor(Math.random() * exampleBody.length)],
    });
  });

  const iterations = seedCount - userMessage.length;
  for (let index = 0; index < iterations; index++) {
    userMessage.push({
      body: exampleBody[Math.floor(Math.random() * exampleBody.length)],
    });
  }
  userMessage.sort(() => Math.random() - 0.5);

  const users = await prisma.user.findMany({
    select: { id: true, role: true },
  });

  for (let index = 0; index < seedCount * users.length; index++) {
    const userID = users[Math.floor(Math.random() * users.length)].id;
    const createdAt = new Date(casual.date());

    let thread = await prisma.thread.findFirst({
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
      thread = await prisma.thread.create({
        data: {
          participantRole: [$Enums.role.ADMIN],
          users: {
            connect: {
              id: userID,
            },
          },
        },
        select: {
          id: true,
        },
      });
    }

    const messageIndex = index % userMessage.length;
    try {
      await prisma.message.create({
        data: {
          subject: userMessage[messageIndex]?.subject ?? null,
          body: userMessage[messageIndex]?.body ?? casual.sentence,
          fromContactForm: !!userMessage[messageIndex]?.subject,
          sender: {
            connect: {
              id: userID,
            },
          },
          thread: {
            connect: {
              id: thread.id,
            },
          },
          ip: casual.ip,
          cookies: casual.random_element([
            "HS256",
            "HS384",
            "HS512",
            "RS256",
            "RS384",
            "RS512",
            "ES256",
            "ES384",
            "ES512",
          ]),
          userAgent: casual.user_agent,
          xAppVersion: `${casual.integer(1, 10)}.${casual.integer(
            0,
            99
          )}.${casual.integer(0, 99)}`,
          createdAt: createdAt,
        },
      });

      if (casual.boolean) {
        const adminId = users.find((user) =>
          user.role.includes($Enums.role.ADMIN)
        );
        await prisma.message.create({
          data: {
            body: casual.sentence,
            sender: {
              connect: {
                id: adminId?.id,
              },
            },
            senderRole: $Enums.role.ADMIN,
            thread: {
              connect: {
                id: thread.id,
              },
            },
            fromContactForm: false,
            ip: casual.ip,
            cookies: casual.random_element([
              "HS256",
              "HS384",
              "HS512",
              "RS256",
              "RS384",
              "RS512",
              "ES256",
              "ES384",
              "ES512",
            ]),
            userAgent: casual.user_agent,
            xAppVersion: `${casual.integer(1, 10)}.${casual.integer(
              0,
              99
            )}.${casual.integer(0, 99)}`,
            createdAt: createdAt,
          },
        });
      }

      await prisma.thread.update({
        where: {
          id: thread.id,
        },
        data: {
          lastMessageAt: createdAt,
        },
      });
    } catch (error) {
      logger.error("error:", error);
      throw new Error("ERROR_CREATING_MESSAGE");
    }
  }

  logger.info(`success :✅ ${seedCount} messages were seeded`);
}
