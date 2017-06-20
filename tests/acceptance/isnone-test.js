import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance: isNone Test');

test('attribute change from value to empty string should result in isPrimed for null and undefined', function(assert) {
  visit('/isnone');
  andThen(function() {
      assert.equal(find("input.name:eq(0)").val(), "");
      assert.equal(find(".nameDirty:eq(0)").text(), "");
      assert.equal(find(".namePrimed:eq(0)").text(), "");
      assert.equal(find("input.name:eq(1)").val(), "");
      assert.equal(find(".nameDirty:eq(1)").text(), "");
      assert.equal(find(".namePrimed:eq(1)").text(), "");
  });
  fillIn("input.name:eq(0)", "");
  fillIn("input.name:eq(1)", "");
  andThen(function() {
      assert.equal(find("input.name:eq(0)").val(), "");
      assert.equal(find(".nameDirty:eq(0)").text(), "true");
      assert.equal(find(".namePrimed:eq(0)").text(), "");
      assert.equal(find("input.name:eq(1)").val(), "");
      assert.equal(find(".nameDirty:eq(1)").text(), "true");
      assert.equal(find(".namePrimed:eq(1)").text(), "");
  });
  fillIn("input.name:eq(0)", "x");
  fillIn("input.name:eq(1)", "x");
  andThen(function() {
      assert.equal(find("input.name:eq(0)").val(), "x");
      assert.equal(find(".nameDirty:eq(0)").text(), "true");
      assert.equal(find(".namePrimed:eq(0)").text(), "true");
      assert.equal(find("input.name:eq(1)").val(), "x");
      assert.equal(find(".nameDirty:eq(1)").text(), "true");
      assert.equal(find(".namePrimed:eq(1)").text(), "true");
  });
  fillIn("input.name:eq(0)", "");
  fillIn("input.name:eq(1)", "");
  andThen(function() {
      assert.equal(find("input.name:eq(0)").val(), "");
      assert.equal(find(".nameDirty:eq(0)").text(), "true");
      assert.equal(find(".namePrimed:eq(0)").text(), "true");
      assert.equal(find("input.name:eq(1)").val(), "");
      assert.equal(find(".nameDirty:eq(1)").text(), "true");
      assert.equal(find(".namePrimed:eq(1)").text(), "true");
  });
});
