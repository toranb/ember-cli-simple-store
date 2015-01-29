import Ember from 'ember';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: B Test', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('the attr in test b should not hold global state across objects', function() {
  visit('/wat');
  andThen(function() {
      equal(find("input.name").val(), "");
  });
});
