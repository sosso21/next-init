import { createModel } from "schemix";
import LogInfoMixin from "../mixins/LogInfo.mixin";
import DateTimeMixin from "../mixins/DateTime.mixin";
import contactSubjectEnum from "../enums/contactSubject.enum";
import { getDatabaseType } from "../db_adapter";
import UserModel from "./User.model";
import roleEnum from "../enums/role.enum";
import ThreadModel from "./Thread.model";

export default createModel((MessageModel: any) => {
  MessageModel.int("id", { id: true, default: { autoincrement: true } })
    .enum("subject", contactSubjectEnum, {
      optional: true,
      map: "subject",
    })
    .string("body", { raw: getDatabaseType("Text") })
    .relation("sender", UserModel, {
      fields: ["senderId"],
      references: ["id"],
    })
    .string("senderId", { map: "sender_id" })

    .enum("senderRole", roleEnum, { optional: true, map: "sender_role" })
    .int("threadId", { map: "thread_id" })
    .relation("thread", ThreadModel, {
      fields: ["threadId"],
      references: ["id"],
      onDelete: "Cascade",
    })
    .dateTime("readAt", { optional: true, map: "read_at" })
    .boolean("fromContactForm", { default: false, map: "from_contact_form" })
    .mixin(LogInfoMixin)
    .mixin(DateTimeMixin)
    .map("Messages");
});
