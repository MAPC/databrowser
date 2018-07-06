import Controller from '@ember/controller';
import { computed } from '@ember-decorators/object';


export default class extends Controller {

  @computed('model')
  get searchables() {
    return this.get('model')
               .map(row => ({ id: row.get('id'), title: row.get('menu3') }));
  }

}
