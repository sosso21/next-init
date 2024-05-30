import { createModel } from 'schemix';
import LogInfoMixin from '../mixins/LogInfo.mixin';
import DateTimeMixin from '../mixins/DateTime.mixin';

export default createModel((LogModel) => {
  LogModel.int('id', { id: true, default: { autoincrement: true } })
    .mixin(LogInfoMixin)
    .mixin(DateTimeMixin)
    .map('logs');
});
