/* eslint-env node */
module.exports = {
  useYarn: true,
  scenarios: [
    {
      name: 'ember-lts-2.12',
      npm: {
        devDependencies: {
          'ember-source': '~2.12.0'
        }
      }
    },
    {
      name: 'ember-2.18.X',
      npm: {
        devDependencies: {
          'ember-source': '~2.18.0'
        }
      }
    },
    {
      name: 'ember-3.1.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.1.1'
        }
      }
    },
    {
      name: 'ember-3.3.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.3.0'
        }
      }
    },
    {
      name: 'ember-3.4.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.4.0'
        }
      }
    },
    {
      name: 'ember-3.7.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.7.0'
        }
      }
    }
  ]
};
