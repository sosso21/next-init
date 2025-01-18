import { $Enums } from "@prisma/client";
import { paginationSchema, rolesSchema } from "@/server/type";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().nullable(),
  phones: z.any(),
  name: z.string().nullable(),
  username: z.string().nullable(),
  image: z.string().nullable(),
  role: z.array(z.custom<$Enums.role>()),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const MessageSchema = z.object({
  id: z.number(),
  body: z.string(),
  createdAt: z.date(),
  readAt: z.date().nullable(),
  threadId: z.number(),
  senderId: z.string(),
  sender: z.object({
    id: z.string(),
    name: z.string().nullable(),
    username: z.string().nullable(),
    image: z.string().nullable(),
  }),
  subject: z.string().nullable(),
  senderRole: z.custom<$Enums.role>().nullable(),
  fromContactForm: z.boolean(),
  ip: z.string().ip().nullable().default(null),
});

export const ThreadSchema = z.object({
  id: z.number(),
  users: z.array(UserSchema),
  messages: z.array(MessageSchema),
  participantRole: z.array(z.custom<$Enums.role>()),
  lastMessageAt: z.date().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const ThreadsOutputSchema = paginationSchema.extend({
  data: z.array(ThreadSchema),
  userId: z.string().nullable(),
  roles: z.array(rolesSchema),
});
export const ThreadOutputSchema = paginationSchema.extend({
  data: ThreadSchema.nullable(),
  userId: z.string().nullable(),
  roles: z.array(rolesSchema),
});

export const sendMessageInputSchema = z.object({
  threadId: z.number(),
  body: z.string().min(1, "MESSAGE_IS_TOO_SHORT"),
});

export type UserType = z.infer<typeof UserSchema>;
export type MessageType = z.infer<typeof MessageSchema>;
export type ThreadType = z.infer<typeof ThreadSchema>;
export type ThreadOutputType = z.infer<typeof ThreadOutputSchema>;
export type ThreadsOutputType = z.infer<typeof ThreadsOutputSchema>;
export type SendMessageInputType = z.infer<typeof sendMessageInputSchema>;
