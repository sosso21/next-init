import { createMixin } from 'schemix';

export default createMixin((DateTimeMixin) => {
  DateTimeMixin.dateTime('createdAt', {
    default: { now: true },
    map: 'created_at',
  })
    .dateTime('updatedAt', {
      updatedAt: true,
      optional: true,
      map: 'updated_at',
    })
    .dateTime('deletedAt', {
      optional: true,
      map: 'deleted_at',
    });
});
