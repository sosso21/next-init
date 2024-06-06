import { createModel } from "schemix";
import DateTimeMixin from "../mixins/DateTime.mixin";
import UserModel from "./User.model";
import { getDatabaseType } from "../db_adapter";

export default createModel((AccountModel) => {
  AccountModel.string("id", { id: true, default: "cuid" })
    .string("userId", { unique: true })
    .string("type")
    .string("provider")
    .string("providerAccountId")
    .string("refresh_token", { optional: true, raw: getDatabaseType("Text") })
    .string("access_token", { optional: true, raw: getDatabaseType("Text") })
    .int("expires_at", { optional: true })
    .string("token_type", { optional: true })
    .string("scope", { optional: true })
    .string("id_token", { optional: true, raw: getDatabaseType("Text") })
    .string("session_state", { optional: true })
    .int("refresh_token_expires_in", { optional: true })
    .relation("user", UserModel, {
      fields: ["userId"],
      references: ["id"],
      optional: true,
    })
    .mixin(DateTimeMixin)
    .unique(["provider", "providerAccountId"])
    .raw("@@index([userId])");
});

/*


model Account {
  id                       String  @id @default(cuid())
  userId                   String  @unique
  type                     String
  provider                 String
  providerAccountId        String
  refresh_token            String? @db.Text
  access_token             String? @db.Text
  expires_at               Int?
  token_type               String?
  scope                    String?
  id_token                 String? @db.Text
  session_state            String?
  refresh_token_expires_in Int?
  user                     User?   @relation(fields: [userId], references: [id])
 
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
 
  @@unique([provider, providerAccountId])
  @@index([userId])
  
}


*/
