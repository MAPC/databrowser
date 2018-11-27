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

    const token = config.database[`${dataset.get('db_name')}Token`] || config.database.dsToken;

    // SQL queries
    let url = `${config.dataBrowserEndpoint}select * from ${prqlSchema}.${dataset.get('table_name')} `;

    if (dataset.get('hasYears')) {
      url += `order by ${yearcolumn} DESC LIMIT 15000;&token=${token}`;
    } else {
      url += ` LIMIT 50;&token=${token}`;
    }

    // check to see if table_data_browser entry marks it as tabular or not
    const tableDatabase = dataset.get('db_name');
    const meta_url = `${config.host}/${tableDatabase}?tables=${dataset.get('table_name')}`;
    const years_url = `${config.dataBrowserEndpoint}select distinct(${yearcolumn}) from ${prqlSchema}.${dataset.get('table_name')} limit 50&token=${token}`;

    // models
    const raw_data = (
      this.get('ajax')
        .request(url)
        .then(imputeSpatiality)
        .catch(handleErrors)
    );

    const metadata = (
      this.get('ajax')
        .request(meta_url)
        .then(metadata => metadata[dataset.get('table_name')])
        .catch(handleErrors)
    );

    const years_available = yearcolumn ? (
      this.get('ajax')
        .request(years_url)
        .then(years => {
          if (dataset.get('hasYears') && years.rows) {
            const keys = years.rows.mapBy(yearcolumn).sort().reverse();
            const obj = keys.map((el, index) => {
              var isSelected = (index === 0);
              return EmberObject.create({ year: el, selected: isSelected });
            });
            return obj;
          }
          else {
            return A([]);
          }
        })
        .catch(handleErrors)
    ): null;

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
