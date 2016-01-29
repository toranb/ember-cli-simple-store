import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import FilteredRecordArray from 'ember-cli-simple-store/models/filtered-record-array';

const { run } = Ember;

function createFilter(simpleStore) {
    simpleStore.push("foo", { id: 1, name: "toran" });

    return simpleStore.find('foo', (foo) => {
      	return foo.name === 'toran';
    });
}

moduleFor('service:simple-store', "unit: user model test", {
    beforeEach() {
        this.register('model:foo', Ember.Object.extend({}));
    }
});

test("returns an instance of filtered record array", function(assert) {
    assert.expect(1);

    const simpleStore = this.subject();

    run(() => {
        const recordArray = createFilter(simpleStore);
        assert.ok(recordArray instanceof FilteredRecordArray);
    });
});

test("manually calling unsubscribe removes from filtersMap", function(assert) {
    assert.expect(2);

    const simpleStore = this.subject();

    run(() => {
        const recordArray = createFilter(simpleStore);
        const filters = simpleStore.get('filtersMap');

        assert.equal(filters.foo.length, 1);
        simpleStore._unsubscribe(recordArray);
        assert.equal(filters.foo.length, 0);
    });
});

test("the record array being destroy triggers an unsubscribe", function(assert) {
    assert.expect(3);

    const done = assert.async();
    const simpleStore = this.subject();

    run(() => {
        const recordArray = createFilter(simpleStore);
        const filters = simpleStore.get('filtersMap');

        assert.equal(filters.foo.length, 1);
        recordArray.destroy();
        assert.equal(recordArray.isDestroying, true);

        run.next(() => {
            assert.equal(filters.foo.length, 0);
            done();
        });
    });
});
