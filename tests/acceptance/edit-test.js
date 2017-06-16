import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance: Edit Test');

test('attribute change from value to empty string should result in isPrimed', function(assert) {
  visit('/edit');
  andThen(() => {
      assert.equal(find("input.name").val(), "toran");
      assert.equal(find(".nameDirty").text(), "");
      assert.equal(find(".namePrimed").text(), "");
  });
  fillIn("input.name", "");
  andThen(() => {
      assert.equal(find("input.name").val(), "");
      assert.equal(find(".nameDirty").text(), "true");
      assert.equal(find(".namePrimed").text(), "true");
  });
  fillIn("input.name", "x");
  andThen(() => {
      assert.equal(find("input.name").val(), "x");
      assert.equal(find(".nameDirty").text(), "true");
      assert.equal(find(".namePrimed").text(), "true");
  });
  fillIn("input.name", "toran");
  andThen(() => {
      assert.equal(find("input.name").val(), "toran");
      assert.equal(find(".nameDirty").text(), "");
      assert.equal(find(".namePrimed").text(), "true");
  });
});
