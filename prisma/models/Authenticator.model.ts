import { createModel } from "schemix";
import UserModel from "./User.model";

export default createModel((AuthenticatorModel) => {
  AuthenticatorModel.string("credentialID", { unique: true })
    .string("userId")
    .string("providerAccountId")
    .string("credentialPublicKey")
    .int("counter")
    .string("credentialDeviceType")
    .boolean("credentialBackedUp")
    .string("transports", { optional: true })
    .relation("user", UserModel, {
      fields: ["userId"],
      references: ["id"],
      onDelete: "Cascade",
    })
    .raw("@@id([userId, credentialID])");
});

/*


// Optional for WebAuthn support
model Authenticator {
  credentialID         String  @unique
  userId               String
  providerAccountId    String
  credentialPublicKey  String
  counter              Int
  credentialDeviceType String
  credentialBackedUp   Boolean
  transports           String?
 
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
 
  @@id([userId, credentialID])
}


*/
