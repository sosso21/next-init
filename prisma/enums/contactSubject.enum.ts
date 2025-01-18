import { createEnum } from "schemix";

export default createEnum((ContactSubjectEnum) => {
  ContactSubjectEnum.addValue("CONTACT_US")
    .addValue("QUOTE_REQUEST")
    .addValue("PHOTO_SESSION_BOOKING")
    .addValue("COLLABORATION_PROPOSAL")
    .addValue("INFORMATION_REQUEST")
    .addValue("SERVICE_INQUIRY")
    .addValue("RESERVATION_MODIFICATION_OR_CANCELLATION")
    .addValue("APPOINTMENT_REQUEST")
    .addValue("PARTNERSHIP_PROPOSAL")
    .addValue("COMPLAINT_OR_TECHNICAL_ISSUE")
    .addValue("PHOTO_USAGE_REQUEST")
    .addValue("OTHER")
    .toString();
});
