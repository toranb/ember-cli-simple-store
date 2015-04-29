import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var application;

module('Acceptance: Defaults B Test', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('text input with default value of empty string should not be dirty when value added then removed', function(assert) {
  visit('/defaultb');
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
      assert.equal(find(".nameDirty").text(), "");
  });
});

test('checkbox input with no default value should be dirty when unchecked', function(assert) {
  visit('/defaultb');
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
      assert.equal(find(".funnyDirty").text(), "true");
  });
});
