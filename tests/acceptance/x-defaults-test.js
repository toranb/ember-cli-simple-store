import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var application;

module('Acceptance: Defaults X Test', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('checkbox input with default value should not be dirty when unchecked', function(assert) {
  visit('/defaultx');
  andThen(function() {
      assert.equal(find("input.funny").is(":checked"), true);
      assert.equal(find(".funnyDirty").text(), "");
      assert.equal(find(".funnyPrimed").text(), "");
  });
  click("input.funny");
  andThen(function() {
      assert.equal(find("input.funny").is(":checked"), false);
      assert.equal(find(".funnyDirty").text(), "true");
      assert.equal(find(".funnyPrimed").text(), "true");
  });
  click("input.funny");
  andThen(function() {
      assert.equal(find("input.funny").is(":checked"), true);
      assert.equal(find(".funnyDirty").text(), "");
      assert.equal(find(".funnyPrimed").text(), "true");
  });
  click("input.funny");
  andThen(function() {
      assert.equal(find("input.funny").is(":checked"), false);
      assert.equal(find(".funnyDirty").text(), "true");
      assert.equal(find(".funnyPrimed").text(), "true");
  });
});
