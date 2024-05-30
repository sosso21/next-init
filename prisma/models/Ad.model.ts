import { createModel } from 'schemix';
import LogInfoMixin from '../mixins/LogInfo.mixin';
import DateTimeMixin from '../mixins/DateTime.mixin';
import { getDatabaseType } from '../db_adapter';

export default createModel((AdModel) => {
  AdModel.int('id', { id: true, default: { autoincrement: true } })
    .string('src', { unique: true, raw: getDatabaseType('VarChar(255)') })
    .string('href', { unique: true, raw: getDatabaseType('VarChar(255)') })
    .string('alt', {
      optional: true,
      unique: true,
      raw: getDatabaseType('VarChar(255)'),
    })
    .boolean('onSlider', { default: true, map: 'on_slider' })
    .boolean('onAside', { default: false, map: 'on_aside' })
    .mixin(DateTimeMixin)
    .map('ads');
});
