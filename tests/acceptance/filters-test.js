import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var application, store;

module('Acceptance: Filters Test', {
  setup: function() {
    application = startApp();
    store = application.__container__.lookup('service:simple-store');
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
      store.push('robot', {id: 2, size: 20});
      store.push('robot', {id: 1, size: 10});
      store.push('robot', {id: 3, size: 30});
      store.push('zing', {id: 2, number: 80});
      store.push('zing', {id: 1, number: 90});
      store.push('zing', {id: 3, number: 70});
  });
  andThen(function() {
      assert.equal(find('.one').find('option').length, 0);
      assert.equal(find('.two').find('option').length, 2);
      assert.equal(find('.three').find('option').length, 0);
      assert.equal(find('.four').find('option').length, 2);
  });
});

test('filters can be thrown out when you navigate away from a given route', function(assert) {
  visit('/filters');
  andThen(function() {
      assert.equal(currentURL(), '/filters');
      var filtersMap = store.get('filtersMap');
      var robotFilters = filtersMap['robot'];
      var zingFilters = filtersMap['zing'];
      assert.equal(robotFilters.length, 2);
      assert.equal(zingFilters.length, 2);
  });
  click('.link-robots');
  andThen(function() {
      assert.equal(currentURL(), '/robots');
      var filtersMap = store.get('filtersMap');
      var robotFilters = filtersMap['robot'];
      var zingFilters = filtersMap['zing'];
      //the filters route did cleanup so removed the filters used :)
      assert.equal(robotFilters.length, 2);
      assert.equal(zingFilters.length, 0);
  });
  click('.link-wat');
  andThen(function() {
      assert.equal(currentURL(), '/wat');
      var filtersMap = store.get('filtersMap');
      var robotFilters = filtersMap['robot'];
      var zingFilters = filtersMap['zing'];
      //the robots route did not cleanup so we now have a memory leak :(
      assert.equal(robotFilters.length, 2);
      assert.equal(zingFilters.length, 0);
  });
  click('.link-filters');
  andThen(function() {
      assert.equal(currentURL(), '/filters');
      var filtersMap = store.get('filtersMap');
      var robotFilters = filtersMap['robot'];
      var zingFilters = filtersMap['zing'];
      //the wat route did not cleanup so we now have a memory leak :(
      assert.equal(robotFilters.length, 4);
      assert.equal(zingFilters.length, 2);
  });
});

test('filters on models with custom primary keys can be thrown out when you leave a route', function(assert) {
  visit('/custom-key');
  andThen(function() {
      assert.equal(currentURL(), '/custom-key');
      var filtersMap = store.get('filtersMap');
      var customKeyFilters = filtersMap['custom-key'];
      assert.equal(customKeyFilters.length, 1);
  });
  click('.link-wat');
  andThen(function() {
      assert.equal(currentURL(), '/wat');
      var filtersMap = store.get('filtersMap');
      var customKeyFilters = filtersMap['custom-key'];
      assert.equal(customKeyFilters.length, 0);
  });
});

test('each filter function will be updated during a push with multiple listeners across multiple routes', function(assert) {
  visit('/filters');
  andThen(function() {
      assert.equal(currentURL(), '/filters');
      assert.equal(find('.one').find('option').length, 3);
      assert.equal(find('.two').find('option').length, 3);
      assert.equal(find('.three').find('option').length, 3);
      assert.equal(find('.four').find('option').length, 3);
      store.push('robot', {id: 2, size: 20});
      store.push('robot', {id: 1, size: 10});
      store.push('robot', {id: 3, size: 30});
      store.push('zing', {id: 2, number: 80});
      store.push('zing', {id: 1, number: 90});
      store.push('zing', {id: 3, number: 70});
  });
  andThen(function() {
      assert.equal(find('.one').find('option').length, 0);
      assert.equal(find('.two').find('option').length, 2);
      assert.equal(find('.three').find('option').length, 0);
      assert.equal(find('.four').find('option').length, 2);
  });
  click('.link-robots');
  andThen(function() {
      assert.equal(currentURL(), '/robots');
      assert.equal(find('.nine').find('option').length, 1);
      assert.equal(find('.eight').find('option').length, 1);
      store.push('robot', {id: 15, name: 'seven', size: 15});
  });
  andThen(function() {
      assert.equal(find('.nine').find('option').length, 1);
      assert.equal(find('.eight').find('option').length, 2);
  });
  click('.link-filters');
  andThen(function() {
      assert.equal(currentURL(), '/filters');
      assert.equal(find('.one').find('option').length, 1);
      assert.equal(find('.two').find('option').length, 5);
      assert.equal(find('.three').find('option').length, 0);
      assert.equal(find('.four').find('option').length, 2);
  });
});
