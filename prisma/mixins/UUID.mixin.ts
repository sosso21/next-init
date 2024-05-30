import { createMixin } from 'schemix';
import { getDatabaseType } from '../db_adapter';

export default createMixin((UUIDMixin) => {
  UUIDMixin.string('id', {
    id: true,
    default: { uuid: true },
    raw: getDatabaseType('Uuid'),
  });
});
