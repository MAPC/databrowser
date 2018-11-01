import DS from 'ember-data';
import { decamelize } from '@ember/string';

export default DS.JSONSerializer.extend({
  keyForAttribute(key) {
    return decamelize(key);
  },

  primaryKey: 'seq_id',

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    payload = payload.rows;
    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
