import { createModel } from "schemix";
import DateTimeMixin from "../mixins/DateTime.mixin";
import { Session } from "inspector";
import SessionModel from "./Session.model";
import AccountModel from "./Account.model";
import AuthenticatorModel from "./Authenticator.model";

export default createModel((UserModel) => {
  UserModel.string("id", { id: true, default: "cuid" })
    .string("name", { optional: true })
    .string("username", { optional: true, unique: true })
    .string("email", { optional: true, unique: true })
    .dateTime("emailVerified", { optional: true })
    .string("image", { optional: true })
    .relation("Session", SessionModel, { list: true })
    .relation("Account", AccountModel, { optional: true })
    .relation("Authenticator", AuthenticatorModel, { list: true })
    .mixin(DateTimeMixin);
});

/*
 
 
model User {
  id            String          @id @default(cuid())
  name          String?
  username      String?         @unique
  email         String?         @unique
  emailVerified DateTime?
  image         String?
  Session       Session[]
  Account       Account?
  // Optional for WebAuthn support
  Authenticator Authenticator[]
 
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
  
 
*/
