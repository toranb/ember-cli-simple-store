import { module, test } from 'qunit';
import initializer from "../../initializers/ember-cli-simple-store";
import config from '../../config/environment';

var originalConfig;

module("initializer unit tests", {
  beforeEach: function() {
    originalConfig = config['ember-cli-simple-store'];
  },
  afterEach: function() {
    if (originalConfig) {
      config['ember-cli-simple-store'] = originalConfig;
      originalConfig = null;
    }
  }
});

test("will invoke inject and register by default", function(assert){
    var injected = false;
    var registered = false;

    var mockApp = {
      inject: function() {
        injected = true;
      },
      register: function() {
        registered = true;
      }
    };

    initializer.initialize(mockApp);

    assert.ok(injected);
    assert.ok(registered);
});

test("will not inject when disableAutoInject is set to true", function(assert){
    var injected = false;
    var registered = false;

    config['ember-cli-simple-store'] = {
      disableAutoInject: true
    };

    var mockApp = {
      inject: function() {
        injected = true;
      },
      register: function() {
        registered = true;
      }
    };

    initializer.initialize(mockApp);

    assert.ok(!injected);
    assert.ok(!registered);
});
