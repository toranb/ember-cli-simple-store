import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance: Defaults B Test');

test('text input with default value of empty string should not be dirty when value added then removed', function(assert) {
  visit('/defaultb');
  andThen(() => {
      assert.equal(find("input.name").val(), "");
      assert.equal(find(".nameDirty").text(), "");
      assert.equal(find(".namePrimed").text(), "");
  });
  fillIn("input.name", "x");
  andThen(() => {
      assert.equal(find("input.name").val(), "x");
      assert.equal(find(".nameDirty").text(), "true");
      assert.equal(find(".namePrimed").text(), "true");
  });
  fillIn("input.name", "");
  andThen(() => {
      assert.equal(find("input.name").val(), "");
      assert.equal(find(".nameDirty").text(), "");
      assert.equal(find(".namePrimed").text(), "true");
  });
});

test('checkbox input with no default value should be dirty when unchecked', function(assert) {
  visit('/defaultb');
  andThen(() => {
      assert.equal(find("input.funny").is(":checked"), false);
      assert.equal(find(".funnyDirty").text(), "");
      assert.equal(find(".funnyPrimed").text(), "");
  });
  click("input.funny");
  andThen(() => {
      assert.equal(find("input.funny").is(":checked"), true);
      assert.equal(find(".funnyDirty").text(), "true");
      assert.equal(find(".funnyPrimed").text(), "true");
  });
  click("input.funny");
  andThen(() => {
      assert.equal(find("input.funny").is(":checked"), false);
      assert.equal(find(".funnyDirty").text(), "true");
      assert.equal(find(".funnyPrimed").text(), "true");
  });
});
