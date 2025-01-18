import { createModel } from "schemix";
import DateTimeMixin from "../mixins/DateTime.mixin";
import { getDatabaseType } from "../db_adapter";
import PageModel from "./Page.model";

export default createModel((ContestWinningModel) => {
  ContestWinningModel.int("id", { id: true, default: { autoincrement: true } })
    .string("title")
    .string("description", { raw: getDatabaseType("Text") })
    .string("picture" , { raw: getDatabaseType("Text") , optional: true })
    .string("blurPicture", { raw : getDatabaseType("Text") , optional: true, map: "blur_picture" })
    .string("link", { optional: true })
    .relation("page", PageModel, { list: true })
    .mixin(DateTimeMixin)
    .map("Contest_Winning");
});
