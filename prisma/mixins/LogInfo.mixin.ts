import { createMixin } from "schemix";

export default createMixin((LogInfoMixin) => {
  LogInfoMixin.string("ip", { optional: true })
    .string("JWToken", {
      optional: true,
      map: "json_web_token",
    })
    .string("userAgent", { map: "user_agent", optional: true })
    .string("xAppVersion", { map: "x_app_version", optional: true });
});
