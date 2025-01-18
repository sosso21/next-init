import { $Enums } from "@prisma/client";
import { z } from "zod";

export const AuthProviderSchema = z.enum(["google", "facebook", "github"]);
export type AuthProviderEnum = z.infer<typeof AuthProviderSchema>;

export const paginationSchema = z.object({
  count: z.number(),
  skip: z.number(),
  take: z.number(),
  hasPreviousPage: z.boolean(),
  hasNextPage: z.boolean(),
});



const  rolesEnum = $Enums.role;

export const roleArray = Object.values(rolesEnum);
export const  rolesSchema  = z
  .enum( roleArray as [string, ...string[]])
  .default( rolesEnum.USER);
