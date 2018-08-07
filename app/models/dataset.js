import DS from 'ember-data';
import config from '../config/environment';

export default DS.Model.extend({
  menu1: DS.attr('string'),
  menu2: DS.attr('string'),
  menu3: DS.attr('string'),
  table_name: DS.attr('string'),
  themeid: DS.attr('number'),
  schemaname: DS.attr('string'),
  active: DS.attr('string'),
  yearcolumn: DS.attr('string'),
  source: DS.attr('string'),
  updated: DS.attr('string'),
  db_name: DS.attr('string'),
  hasYears: Ember.computed('yearcolumn', function() {
    return !!this.get('yearcolumn');
  })
});
