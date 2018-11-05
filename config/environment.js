'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'databrowser',
    environment,
    rootURL: '/',
    locationType: 'auto',
    dataBrowserIndex: 'https://prql.mapc.org/?token=16a2637ee33572e46f5609a578b035dc&query=SELECT%20*%20FROM%20tabular._data_browser%20WHERE%20active%20%3D%20%27Y%27%20ORDER%20BY%20menu1,menu2,menu3%20ASC',
    dataBrowserEndpoint: 'https://prql.mapc.org/?query=',
    spatialJoinFields: [  { field: 'ct10_id', table: 'census_2010_tracts'},
                          { field: 'muni_id', table: 'ma_municipalities'}
                          // { field: 'bg10_id', table: ''}
                        ],
    database: {
        dsToken: '16a2637ee33572e46f5609a578b035dc',
        gisdataToken: 'e2e3101e16208f04f7415e36052ce59b',
        towndataToken: '1b9b9a1d1738c3dce14331040fa17008'
    },
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
    ENV.host = 'http://localhost:9292';
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
