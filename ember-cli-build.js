'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, (
    process.env.EMBER_ENV !== 'production'
    ? {
      babel: {
        sourceMaps: 'inline',
      },
    } : {}
  ));

  return app.toTree();
};
