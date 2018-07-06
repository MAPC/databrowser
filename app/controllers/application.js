import Controller from '@ember/controller';
import { computed } from '@ember-decorators/object';
import config from 'databrowser/config/environment';


export default class extends Controller {

  constructor() {
    super(...arguments);

    this.queryParams = ['selectedCategory'];
    this.selectedCategory = null;
    this.primaryCount = 0;
    this.hostname = config.metadataHost;
  }


  @computed('model')
  get searchables() {
  }

}
