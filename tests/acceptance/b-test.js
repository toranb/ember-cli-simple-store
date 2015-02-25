import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var application;

module('Acceptance: B Test', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('the attr in test b should not hold global state across objects', function(assert) {
  visit('/wat');
  andThen(function() {
      assert.equal(find("input.name").val(), "");
  });
});
