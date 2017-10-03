import Ember from 'ember';
import { module, test } from 'qunit';
import { qunit } from '../helpers/qunit';

const originalWarn = Ember.warn;
let warnings;

module("unit: deprecated qunit helper", {
    beforeEach() {
        warnings = [];
        Ember.warn = (...args) => warnings.push(args);
    },
    afterEach() {
        Ember.warn = originalWarn;
    }
});

test("it logs deprecation message", function(assert){
    qunit();
    assert.equal(warnings.length, 1, 'warns on usage');
    assert.equal(warnings[0][2].id, 'ember-cli-simple-store.qunit-import');
});
