import { createModel } from "schemix";
import DateTimeMixin from "../mixins/DateTime.mixin";
import { getDatabaseType } from "../db_adapter";
import PageModel from "./Page.model";
import ContestWinningModel from "./ContestWinning.model";

export default createModel((PageContestWinningModel) => {
  PageContestWinningModel.int("id", { id: true, default: { autoincrement: true } })
  .int("pageId", { map: "page_id" })
  .relation("page", PageModel, {
    fields: ["pageId"],
    references: ["id"],
  })
  .int("contestWinningId", { map: "contest_winning_id" })
  .relation("contestWinning", ContestWinningModel, {
    fields: ["contestWinningId"],
    references: ["id"],
  })
  
    .map("Page_Contest_Winning");
});
