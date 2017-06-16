import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance: B Test');

test('the attr in test b should not hold global state across objects', function(assert) {
  visit('/wat');
  andThen(() => {
      assert.equal(find("input.name").val(), "");
  });
});
