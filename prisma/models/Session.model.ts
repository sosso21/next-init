import { createModel } from "schemix";
import DateTimeMixin from "../mixins/DateTime.mixin";
import UserModel from "./User.model";

export default createModel((SessionModel) => {
  SessionModel.string("id", { id: true, default: "cuid" })
    .string("sessionToken", { unique: true })
    .string("userId")
    .dateTime("expires")
    .relation("user", UserModel, {
      fields: ["userId"],
      references: ["id"],
    })
    .mixin(DateTimeMixin)
    .raw("@@index([userId])");
});

/*

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id])
 
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
 
  @@index([userId])
}
 


*/
