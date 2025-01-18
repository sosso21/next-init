import { createModel } from "schemix";
import LogInfoMixin from "../mixins/LogInfo.mixin";
import DateTimeMixin from "../mixins/DateTime.mixin";
import UserModel from "./User.model";
import { strict } from "assert";
import ImageModel from "./Image.model";
import GalleryModel from "./Gallery.model";
import servicePageEnum from "../enums/servicePage.enum";

export default createModel((GalleryImageModel) => {
  GalleryImageModel.int("id", { id: true, default: { autoincrement: true } })

    .int("imageId", { map: "image_id" })
    .relation("image", ImageModel, {
      fields: ["imageId"],
      references: ["id"],
    })
    .int("galleryId", { map: "gallery_id" })
    .relation("gallery", GalleryModel, {
      list: true,
    })
    .mixin(DateTimeMixin)
    .map("gallery_images");
});
