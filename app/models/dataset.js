import DS from 'ember-data';
import { attr } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';


export default class extends DS.Model {

  @attr('string') menu1
  @attr('string') menu2
  @attr('string') menu3
  @attr('string') table_name
  @attr('string') themeid
  @attr('string') schemaname
  @attr('string') active
  @attr('string') yearcolumn
  @attr('string') source
  @attr('string') updated
  @attr('string') db_name

  @computed('yearcolumn')
  get hasYears() {
    return !!this.get('yearcolumn');
  }

}
