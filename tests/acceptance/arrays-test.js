import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance: Arrays Test', {
  beforeEach() {
    this.store = this.application.__container__.lookup('service:simple-store');
  },
  afterEach() {
    delete this.store;
  }
});

test('pushArray will trigger filter for each subscription', function(assert) {
  visit('/arrays');
  andThen(() => {
      assert.equal(find('.one').find('option').length, 3);
      assert.equal(find('.two').find('option').length, 3);
      assert.equal(find('.three').find('option').length, 3);
      assert.equal(find('.four').find('option').length, 3);

      this.store.pushArray('robot', [{id: 2, size: 20}, {id: 1, size: 10}, {id: 3, size: 30}]);
      this.store.pushArray('zing', [{id: 2, number: 80}, {id: 1, number: 90}, {id: 3, number: 70}]);
  });
  andThen(() => {
      assert.equal(find('.one').find('option').length, 0);
      assert.equal(find('.two').find('option').length, 2);
      assert.equal(find('.three').find('option').length, 0);
      assert.equal(find('.four').find('option').length, 2);
  });
});
