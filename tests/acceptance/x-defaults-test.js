import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance: Defaults X Test');

test('checkbox input with default value should not be dirty when unchecked', function(assert) {
  visit('/defaultx');
  andThen(() => {
      assert.equal(find("input.funny").is(":checked"), true);
      assert.equal(find(".funnyDirty").text(), "");
      assert.equal(find(".funnyPrimed").text(), "");
  });
  click("input.funny");
  andThen(() => {
      assert.equal(find("input.funny").is(":checked"), false);
      assert.equal(find(".funnyDirty").text(), "true");
      assert.equal(find(".funnyPrimed").text(), "true");
  });
  click("input.funny");
  andThen(() => {
      assert.equal(find("input.funny").is(":checked"), true);
      assert.equal(find(".funnyDirty").text(), "");
      assert.equal(find(".funnyPrimed").text(), "true");
  });
  click("input.funny");
  andThen(() => {
      assert.equal(find("input.funny").is(":checked"), false);
      assert.equal(find(".funnyDirty").text(), "true");
      assert.equal(find(".funnyPrimed").text(), "true");
  });
});
