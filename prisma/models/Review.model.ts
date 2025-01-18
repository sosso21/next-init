import { createModel } from "schemix";
import DateTimeMixin from "../mixins/DateTime.mixin";
import UserModel from "./User.model";
import { getDatabaseType } from "../db_adapter";
import LogInfoMixin from "../mixins/LogInfo.mixin";

export default createModel((reviewModel) => {
  reviewModel
    .int("id", { id: true, default: { autoincrement: true } })
    .string("profilePicture", {
      optional: true,
      raw: getDatabaseType("Text"),
      map: "profile_picture",
    })
    .string("author", { optional: true })
    .int("serviceQuality", { map: "service_quality" })
    .int("responseTime")
    .int("professionalism")
    .int("valueForMoney")
    .int("flexibility")
    .float("rank")
    .string("title", { optional: true })
    .string("body", { raw: getDatabaseType("Text") })
    .string("response", { optional: true })
    .relation("user", UserModel, {
      fields: ["userId"],
      references: ["id"],
      optional: true,
    })
    .string("userId", { optional: true, map: "user_id" })
    .boolean("isGhast", { default: false, map: "is_ghast" })
    .boolean("isAccepted", { default: false, map: "is_accepted" })
    .boolean("validatedByAdmin", { default: false, map: "validated_by_admin" })
    .mixin(LogInfoMixin)
    .mixin(DateTimeMixin)

    .map("Reviews");
});
