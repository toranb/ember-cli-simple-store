import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var application;

module('Acceptance: Delete Object Test', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('when object is removed from store all timers and observers are killed', function(assert) {
  var lastNumber;
  var done = assert.async();
  visit('/delete-object');
  andThen(function() {
    assert.ok(parseInt(find(".number-is").text(), 10) > 0);
  });
  Ember.run.later(function() {
    find("button.stop").trigger("click");
    lastNumber = parseInt(find(".number-is").text(), 10);
  }, 500);
  Ember.run.later(function() {
    assert.equal(parseInt(find(".number-is").text(), 10), lastNumber);
    assert.equal(window.number, lastNumber + 1);
    done();
  }, 1500);
});
