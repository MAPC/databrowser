'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'databrowser',
    environment,
    rootURL: '/',
    locationType: 'auto',
    dataBrowserIndex: 'http://prql.mapc.org/?query=select%20*%20from%20tabular._data_browser%20where%20schemaname%3D%27tabular%27%20or%20schemaname%3D%27mapc%27%20and%20active%3D%27Y%27',
    dataBrowserEndpoint: 'http://prql.mapc.org/?query=',
    spatialJoinFields: [  { field: 'ct10_id', table: 'census_2010_tracts'},
                          { field: 'muni_id', table: 'ma_municipalities'}
                          // { field: 'bg10_id', table: ''}
                        ],
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    'ember-d3': {
      only: ['d3-collection'],
    },
  };

  if (environment === 'development') {
    ENV.host = 'https://staging.datacommon.mapc.org/';
  }

  if (environment === 'staging') {
    ENV.host = 'https://staging.datacommon.mapc.org';
    ENV.rootURL = '/browser';
  }

  if (environment === 'production') {
    ENV.host = 'https://datacommon.mapc.org';
    ENV.rootURL = '/browser';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  return ENV;
};
