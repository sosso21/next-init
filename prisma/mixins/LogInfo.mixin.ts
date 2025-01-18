import { createMixin } from "schemix";
import { getDatabaseType } from "../db_adapter";

export default createMixin((LogInfoMixin) => {
  LogInfoMixin.string("ip", { optional: true })
    .string("cookies", {
      optional: true,
      raw: getDatabaseType("Text"),
      map: "cookie",
    })
    .string("userAgent", { optional: true, map: "user_agent" })
    .string("xAppVersion", { optional: true, map: "x_app_version" })
    .int("screenWidth", { optional: true, map: "screen_width" })
    .int("screenHeight", { optional: true, map: "screen_height" });
});
