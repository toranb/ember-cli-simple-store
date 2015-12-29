import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var application, store;

module('Acceptance: Filters Test', {
  setup: function() {
    application = startApp();
    store = application.__container__.lookup('store:main');
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('push will trigger filter for each subscription', function(assert) {
  visit('/filters');
  andThen(function() {
      assert.equal(find('.one').find('option').length, 3);
      assert.equal(find('.two').find('option').length, 3);
      assert.equal(find('.three').find('option').length, 3);
      assert.equal(find('.four').find('option').length, 3);
      Ember.run(function() {
          store.push('robot', {id: 2, size: 20});
          store.push('robot', {id: 1, size: 10});
          store.push('robot', {id: 3, size: 30});
      });
      Ember.run(function() {
          store.push('zing', {id: 2, number: 80});
          store.push('zing', {id: 1, number: 90});
          store.push('zing', {id: 3, number: 70});
      });
  });
  andThen(function() {
      assert.equal(find('.one').find('option').length, 0);
      assert.equal(find('.two').find('option').length, 2);
      assert.equal(find('.three').find('option').length, 0);
      assert.equal(find('.four').find('option').length, 2);
  });
});
