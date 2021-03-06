'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {

  const config = {
    hinting: process.env.EMBER_ENV !== 'test',
    minifyCSS: {
      enabled: false,
      options: {}
    },
    fingerprint: {
        enabled: false,
      },
  };

  let app = new EmberApp(defaults, (
    process.env.EMBER_ENV !== 'production'
    ? {
      ...config,
      babel: {
        sourceMaps: 'inline',
      },
    } : config
  ));

  return app.toTree();
};
