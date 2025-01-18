import { createModel } from "schemix";
import DateTimeMixin from "../mixins/DateTime.mixin";
import servicePageEnum from "../enums/servicePage.enum";
import ImageModel from "./Image.model";
import CollaborationModel from "./Collaboration.model";
import ContestWinningModel from "./ContestWinning.model";

export default createModel((PageModel) => {
  PageModel.int("id", { id: true, default: { autoincrement: true } })
    .string("slug", { unique: true })

    .string("backgroundColor", { optional: true, map: "background_color" })
    .string("backgroundOpacity", { optional: true, map: "background_opacity" })
    .int("backgroundImageId", {
      optional: true,
      map: "background_image_id",
    })
    .relation("backgroundImage", ImageModel, {
      fields: ["backgroundImageId"],
      references: ["id"],
      optional: true,
    })
    .enum("category", servicePageEnum, {
      default: "DEFAULT",
      unique: true,
    })

    .relation("collaboration", CollaborationModel, { list: true })
    .relation("ContestWinning", ContestWinningModel, { list: true })

    .mixin(DateTimeMixin)
    .map("Pages");
});
