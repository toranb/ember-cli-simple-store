import Ember from 'ember';
import Foo from "dummy/models/foo";
import startApp from '../helpers/start-app';

var application;

module('Acceptance: A Test', {
  setup: function() {
    application = startApp();
    Foo.create({name: "wat"});
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('the attr in test a should not hold global state across objects', function() {
  visit('/wat');
  andThen(function() {
      ok(true);
  });
});
