'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {

  const config = {
    hinting: process.env.EMBER_ENV !== 'test',
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
      minifyCSS: {
        enabled: false,
        options: {}
      },
    } : config
  ));

  return app.toTree();
};
