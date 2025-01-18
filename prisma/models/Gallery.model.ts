import { createModel } from "schemix";
import DateTimeMixin from "../mixins/DateTime.mixin";
import UserModel from "./User.model";
import servicePageEnum from "../enums/servicePage.enum";
import ImageModel from "./Image.model";

export default createModel((galleryModel) => {
  galleryModel
    .int("id", { id: true, default: { autoincrement: true } })

    .string("slug", { unique: true })
    .string("profilePicture", {
      optional: true,
      map: "profile_picture",
    })
    .string("tumblrProfilePicture", {
      optional: true,
      map: "tumblr_profile_picture",
    })
    .boolean("isVital", { default: false, map: "is_vital" })
    .relation("images", ImageModel, {
      list: true,
    })
    .relation("users", UserModel, {
      list: true,
    })
    .enum("category", servicePageEnum, {
      optional: true,
      default: "DEFAULT",
      map: "category",
    })
    .boolean("private", { default: true, map: "private" })
    .mixin(DateTimeMixin)
    .map("Galleries");
});
