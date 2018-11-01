import Route from '@ember/routing/route';
import { action } from '@ember-decorators/object';


export default class extends Route {

  model() {
    return this.store.findAll('dataset');
  }

  @action
  selectDataset(dataset) {
    this.transitionTo('datasets', dataset.id);
  }

}
