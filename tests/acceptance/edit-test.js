import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var application;

module('Acceptance: Edit Test', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('attribute change from value to empty string should result in isPrimed', function(assert) {
  visit('/edit');
  andThen(function() {
      assert.equal(find("input.name").val(), "toran");
      assert.equal(find(".nameDirty").text(), "");
      assert.equal(find(".namePrimed").text(), "");
  });
  fillIn("input.name", "");
  andThen(function() {
      assert.equal(find("input.name").val(), "");
      assert.equal(find(".nameDirty").text(), "true");
      assert.equal(find(".namePrimed").text(), "true");
  });
  fillIn("input.name", "x");
  andThen(function() {
      assert.equal(find("input.name").val(), "x");
      assert.equal(find(".nameDirty").text(), "true");
      assert.equal(find(".namePrimed").text(), "true");
  });
  fillIn("input.name", "toran");
  andThen(function() {
      assert.equal(find("input.name").val(), "toran");
      assert.equal(find(".nameDirty").text(), "");
      assert.equal(find(".namePrimed").text(), "true");
  });
});
