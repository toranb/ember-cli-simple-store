import Ember from 'ember';
const { run } = Ember;
import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance: Delete Object Test');

test('when object is removed from store all timers and observers are killed', function(assert) {
  var lastNumber;
  var done = assert.async();
  visit('/delete-object');
  andThen(() => {
    assert.ok(parseInt(find(".number-is").text(), 10) > 0);
  });
  run.later(() => {
    find("button.stop").trigger("click");
    lastNumber = parseInt(find(".number-is").text(), 10);
  }, 500);
  run.later(() => {
    assert.equal(parseInt(find(".number-is").text(), 10), lastNumber);
    assert.equal(window.number, lastNumber + 1);
    done();
  }, 1500);
});
