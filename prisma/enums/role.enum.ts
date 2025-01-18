import { createEnum } from "schemix";

export default createEnum((RoleEnum) => {
  RoleEnum.addValue("USER")
    .addValue("ADMIN")

    .toString();
});
