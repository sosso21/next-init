import { createModel } from "schemix";
import DateTimeMixin from "../mixins/DateTime.mixin";
import UserModel from "./User.model";
import roleEnum from "../enums/role.enum";
import MessageModel from "./Message.model";

export default createModel((ThreadModel) => {
  ThreadModel.int("id", { id: true, default: { autoincrement: true } })
    .relation("messages", MessageModel, { list: true, })
    .relation("users", UserModel, { list: true })
    .enum("participantRole", roleEnum, {
      list: true,
      map: "participant_role",
    })
    .dateTime("lastMessageAt", { optional: true, map: "last_message_at" })
    .mixin(DateTimeMixin)
    .map("Threads");
});
