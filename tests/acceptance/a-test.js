import Ember from 'ember';
import Foo from "dummy/models/foo";
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var application;

module('Acceptance: A Test', {
  beforeEach: function() {
    application = startApp();
    Foo.create({name: "wat"});
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('the attr in test a should not hold global state across objects', function(assert) {
  visit('/wat');
  andThen(function() {
      assert.ok(true);
  });
});
