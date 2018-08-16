import RSVP from 'rsvp';
import { A } from '@ember/array';
import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { isAjaxError } from 'ember-ajax/errors';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import config from 'databrowser/config/environment';
import imputeSpatiality from 'databrowser/utils/impute-spatiality';


export default class extends Route {

  @service ajax

  model(params) {
    let dataset = this.modelFor('application').findBy('id', params.dataset_id);
    let yearcolumn = dataset.get('yearcolumn');
    const prqlSchema = dataset.get('schemaname');

    let token;
    switch (dataset.get('db_name')) {
      case 'ds':
        token = config.database.dsToken
        break;
      case 'gisdata':
        token = config.database.gisdataToken
        break;
      case 'towndata':
        token = config.database.towndataToken
        break;
      default:
        token = config.database.dsToken
    }

    // SQL queries
    let url = `${config.dataBrowserEndpoint}select * from ${prqlSchema}.${dataset.get('table_name')} `;

    if (dataset.get('hasYears')) {
      url += `order by ${yearcolumn} ASC;&token=${token}`;
    } else {
      url += ` LIMIT 50;&token=${token}`;
    }

    // check to see if table_data_browser entry marks it as tabular or not
    const tableSchema = dataset.get('schemaname') === 'tabular' ? 'tabular' : 'geospatial';
    let meta_url = `${config.host}/${tableSchema}?tables=${dataset.get('table_name')}`;
    let years_url = `${config.dataBrowserEndpoint}select distinct(${yearcolumn}) from ${prqlSchema}.${dataset.get('table_name')} limit 50&token=${token}`;

    // models
    let raw_data = this.get('ajax').request(url).then(function(raw_data) {
      return imputeSpatiality(raw_data);
    }).catch(handleErrors);

    let metadata = this.get('ajax').request(meta_url).then(function(metadata) {
      return metadata[dataset.get('table_name')];
    }).catch(handleErrors);

    let years_available = this.get('ajax').request(years_url).then(function(years) {
      if (dataset.get('hasYears')) {
        let keys = years.rows.mapBy(yearcolumn).sort().reverse();
        let obj = keys.map((el, index) => {
          let isSelected = (index === 0);
          return EmberObject.create({ year: el, selected: isSelected });
        });
        return obj;
      } else {
        return A([]);
      }
    }).catch(handleErrors);

    return RSVP.hash({
      dataset,
      raw_data,
      metadata,
      years_available
    });
  }

  afterModel(model) {
    if (!isAjaxError(model.raw_data)) {
      let fields = model.raw_data.fields;

      delete fields['the_geom'];
      delete fields['the_geom_webmercator'];
      delete fields['cartodb_id'];
      delete fields['invalid_the_geom'];
      delete fields['shape'];
    }
  }

  @action
  transitionTo(category) {
    this.get('router').transitionTo('categories.sub-categories.datasets', category);
  }

  @action
  willTransition() {
    let datasetsController = this.controllerFor('datasets');
    datasetsController.set('years', A);
  }

}

function handleErrors(error) {
  if(isAjaxError(error)) {
    // handle all other AjaxErrors here
    return error;
  }

  // other errors are handled elsewhere
  throw error;
}
