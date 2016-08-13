import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';
import { moduleFor, test } from 'ember-qunit';
import registration from "dummy/tests/helpers/registration";

const { run } = Ember;

let store;

moduleFor('model:foo', "unit: foo model test", {
    beforeEach() {
        const owner = getOwner(this);
        store = registration(owner, ["model:foo"]);
    }
});

test("properties in init method can be setup correctly", function(assert){
    let foo;
    run(() => {
      foo = store.push('foo', {id: 1, bar: [2]});
    });
    assert.deepEqual(foo.get('bar'), [2]);
});
