import { createMixin } from "schemix";

export default createMixin((LogInfoMixin) => {
  LogInfoMixin.string("ip", { optional: true })
    .string("jsonWebToken", {
      optional: true,
      map: "json_web_token",
    })
    .string("userAgent", { optional: true, map: "user_agent" })
    .string("xAppVersion", { optional: true, map: "x_app_version" });
});
