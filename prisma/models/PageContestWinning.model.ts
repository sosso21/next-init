import { createModel } from "schemix";
import DateTimeMixin from "../mixins/DateTime.mixin";
import { getDatabaseType } from "../db_adapter";
import PageModel from "./Page.model";
import CollaborationModel from "./Collaboration.model";

export default createModel(( PageCollaborationModel ) => {
PageCollaborationModel.int("id", {
  id: true,
  default: { autoincrement: true },
})
  .int("pageId", { map: "page_id" })
  .relation("page", PageModel, {
    fields: ["pageId"],
    references: ["id"],
  })
  .int("collaborationId", { map: "collaboration_id" })
  .relation("collaboration", CollaborationModel, {
    fields: ["collaborationId"],
    references: ["id"],
  })

  .map("page_collaborations");
});
