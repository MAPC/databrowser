/* eslint-env node */
'use strict';

module.exports = function(deployTarget) {
  let ENV = {
    build: {
      environment: deployTarget,
    },

    'revision-data': {
      type: 'git-commit',
    },
  };

  if (deployTarget === 'staging') {
    ENV.rsync = {
      dest: 'databrowser@prep.mapc.org:/var/www/databrowser/browser',
      delete: false,
    };
  }

  if (deployTarget === 'production') {
    ENV.rsync = {
      dest: 'databrowser@live.mapc.org:/var/www/databrowser/browser',
      delete: false,
    };
  }

  return ENV;
};
