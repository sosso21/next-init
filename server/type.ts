import facebook from "next-auth/providers/facebook";
import { z } from "zod";

export const AuthProviderSchema = z.enum(["google", "facebook", "github"]);
export type AuthProviderEnum = z.infer<typeof AuthProviderSchema>;
