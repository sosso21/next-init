import { createModel } from "schemix";
import LogInfoMixin from "../mixins/LogInfo.mixin";
import DateTimeMixin from "../mixins/DateTime.mixin";
import UserModel from "./User.model";
import { strict } from "assert";
import GalleryImageModel from "./GalleryImage.model";
import GalleryModel from "./Gallery.model";

export default createModel((ImageModel) => {
  ImageModel.int("id", { id: true, default: { autoincrement: true } })
    .string("webp")
    .string("original")
    .string("tumblr")
    .string("host")
    .relation("galleries", GalleryModel, {
      list: true,
    })
    .mixin(DateTimeMixin)
    .map("Images");
});
