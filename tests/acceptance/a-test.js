import Foo from "dummy/models/foo";
import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance: A Test', {
  beforeEach: () => {
    Foo.create({name: "wat"});
  }
});

test('the attr in test a should not hold global state across objects', function(assert) {
  visit('/wat');
  andThen(() => {
      assert.ok(true);
  });
});
