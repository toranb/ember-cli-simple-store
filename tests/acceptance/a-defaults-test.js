import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var application;

module('Acceptance: Defaults A Test', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('text input with no default value should be dirty when value added then removed', function(assert) {
  visit('/defaulta');
  andThen(function() {
      assert.equal(find("input.name").val(), "");
      assert.equal(find(".nameDirty").text(), "");
  });
  fillIn("input.name", "x");
  andThen(function() {
      assert.equal(find("input.name").val(), "x");
      assert.equal(find(".nameDirty").text(), "true");
  });
  fillIn("input.name", "");
  andThen(function() {
      assert.equal(find("input.name").val(), "");
      assert.equal(find(".nameDirty").text(), "true");
  });
});

test('checkbox input with default value of false should not be dirty when unchecked', function(assert) {
  visit('/defaulta');
  andThen(function() {
      assert.equal(find("input.funny").is(":checked"), false);
      assert.equal(find(".funnyDirty").text(), "");
  });
  click("input.funny");
  andThen(function() {
      assert.equal(find("input.funny").is(":checked"), true);
      assert.equal(find(".funnyDirty").text(), "true");
  });
  click("input.funny");
  andThen(function() {
      assert.equal(find("input.funny").is(":checked"), false);
      assert.equal(find(".funnyDirty").text(), "");
  });
});
