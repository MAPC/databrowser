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

    // SQL queries
    let url = `${config.dataBrowserEndpoint}select * from ${dataset.get('table_name')} `;

    if (dataset.get('isMunicipal') && dataset.get('hasYears')) {
      url += `where ${yearcolumn}=(select max(${yearcolumn}) from ${dataset.get('table_name')}) order by municipal ASC;`;
    } else {
      url += ' LIMIT 50;';
    }

    // check to see if table_data_browser entry marks it as tabular or not
    let meta_url
    if (dataset.get('schemaname') !== 'tabular') {
      meta_url = `${config.metadataHost}/geospatial?tables=${dataset.get('table_name')}`;
    } else {
      meta_url = `${config.metadataHost}/tabular?tables=${dataset.get('table_name')}`;
    }

    let years_url = `${config.dataBrowserEndpoint}select distinct(${yearcolumn}) from ${dataset.get('table_name')} limit 50`;

    // models
    let raw_data = this.get('ajax').request(url).then(function(raw_data) {
      return imputeSpatiality(raw_data);
    }).catch(handleErrors);

    let metadata = this.get('ajax').request(meta_url).then(function(metadata) {
      return metadata[dataset.get('table_name')];
    }).catch(handleErrors);

    let years_available = this.get('ajax').request(years_url).then(function(years) {
      if (dataset.get('hasYears')) {
        let keys = years.rows.mapBy(yearcolumn).sort();
        let obj = keys.map((el) => { return EmberObject.create({ year: el, selected: true }); });
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
