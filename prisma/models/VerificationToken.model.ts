import { createModel } from "schemix";

export default createModel((VerificationTokenModel) => {
  VerificationTokenModel.string("identifier")
    .string("token")
    .dateTime("expires")
    .unique(["identifier", "token"]);
});

/*
 
model VerificationToken {
  identifier String
  token      String
  expires    DateTime
 
  @@unique([identifier, token])
}
 
*/
