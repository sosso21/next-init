import { createModel } from "schemix";
import LogInfoMixin from "../mixins/LogInfo.mixin";
import DateTimeMixin from "../mixins/DateTime.mixin";
import UserModel from "./User.model";
import GalleryModel from "./Gallery.model";

export default createModel((GalleryUserModel) => {
  GalleryUserModel.int("id", { id: true, default: { autoincrement: true } })

    .string("userId", { map: "user_id" })
    .relation("user", UserModel, {
      fields: ["userId"],
      references: ["id"],
    })
    .int("galleryId", { map: "gallery_id" })
    .relation("gallery", GalleryModel, {
      fields: ["galleryId"],
      references: ["id"],
      onDelete: "Cascade",
    })
    .mixin(DateTimeMixin)
    .map("gallery_users");
});
