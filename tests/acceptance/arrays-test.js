import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var application, store;

module('Acceptance: Arrays Test', {
  setup: function() {
    application = startApp();
    store = application.__container__.lookup('service:simple-store');
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('pushArray will trigger filter for each subscription', function(assert) {
  visit('/arrays');
  andThen(function() {
      assert.equal(find('.one').find('option').length, 3);
      assert.equal(find('.two').find('option').length, 3);
      assert.equal(find('.three').find('option').length, 3);
      assert.equal(find('.four').find('option').length, 3);

      store.pushArray('robot', [{id: 2, size: 20}, {id: 1, size: 10}, {id: 3, size: 30}]);
      store.pushArray('zing', [{id: 2, number: 80}, {id: 1, number: 90}, {id: 3, number: 70}]);
  });
  andThen(function() {
      assert.equal(find('.one').find('option').length, 0);
      assert.equal(find('.two').find('option').length, 2);
      assert.equal(find('.three').find('option').length, 0);
      assert.equal(find('.four').find('option').length, 2);
  });
});
