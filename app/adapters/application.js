import DS from 'ember-data';
import config from 'databrowser/config/environment';

export default class extends DS.RESTAdapter {

  constructor() {
    super();

    this.host = config.dataBrowserIndex;
  }

  urlForFindAll() {
    return config.dataBrowserIndex;
  }

}
