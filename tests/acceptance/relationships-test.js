import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance: Relationships Test', {
  beforeEach() {
    this.store = this.application.__container__.lookup('service:simple-store');
  }
});

test('changing the users role will alter the underlying relationship', function(assert) {
  visit('/relationships');
  andThen(() => {
      var options = find('.all-roles');
      assert.equal(options.find('option').length, 2);
      assert.equal(options.find('option:eq(0)').val(), 8);
      assert.equal(options.find('option:eq(1)').val(), 9);
      assert.equal(options.find('option:eq(0)').text(), 'Admin');
      assert.equal(options.find('option:eq(1)').text(), 'Guest');
      assert.equal(options.find('option:selected').val(), 9);
      assert.equal(this.store.find('user', 2).get('role.id'), 9);
  });
  fillIn('.all-roles', 8);
  andThen(() => {
      var options = find('.all-roles');
      assert.equal(options.find('option').length, 2);
      assert.equal(options.find('option:selected').val(), 8);
      assert.equal(this.store.find('user', 2).get('role.id'), 8);
  });
});

test('updateContent only fires for models with subscribers and only once per run', function(assert) {
  var roleUpdated = 0;
  visit('/relationships');
  andThen(() => {
      assert.equal(this.store.find('user', 2).get('role.id'), 9);
      var filtersMap = this.store.get("filtersMap");
      var roleFunc = filtersMap["role"];
      var origRoleFunc = roleFunc[0].updateContent;
      roleFunc[0].updateContent = function() {
          roleUpdated = roleUpdated + 1;
          return origRoleFunc.apply(this, arguments);
      };
      var userFunc = filtersMap["user"];
      assert.equal(userFunc, undefined);
  });
  fillIn('.all-roles', 8);
  andThen(() => {
      assert.equal(this.store.find('user', 2).get('role.id'), 8);
      assert.equal(roleUpdated, 1);
  });
});
