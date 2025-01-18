import { createEnum } from "schemix";

export default createEnum((LocationEnum) => {
  LocationEnum.addValue("ar")
    .addValue("en")
    .addValue("es")
    .addValue("fr")

    .toString();
});
