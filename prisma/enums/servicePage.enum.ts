import { createEnum } from "schemix";

export default createEnum((servicePageEnum) => {
  servicePageEnum

    .addValue("DEFAULT")
    .addValue("MARRIAGE")
    .addValue("PORTRAIT")
    .addValue("EVENT")
    .addValue("ENTERPRISE")
    .addValue("PREGNANCY")

    .toString();
});
