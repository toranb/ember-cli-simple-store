import EmberObject, { observer } from '@ember/object';
import { getOwner } from '@ember/application';
import { moduleFor } from "ember-qunit";
import { test } from "ember-cli-simple-store/test-support/qunit";

let Thing, Stuff;

moduleFor("service:simple-store", "arrays unit tests", {
    beforeEach: function () {
        const owner = getOwner(this);
        this.store = this.subject();
        Stuff = EmberObject.extend();

        Thing = EmberObject.extend({
            observationCount: 0,
            name: "",
            stuff: this.store.find("stuff"),
            observeStuff: observer("stuff.[]", function () {
                let currentObservations = this.get("observationCount");
                this.set("observationCount", currentObservations + 1);
            })
        });
        owner.register("model:stuff", Stuff);
    },
    afterEach: function() {
        delete this.store;
    }
});

test("observers are only notified once regardless of the number of models added to the store", function (assert) {
    let thing1 = Thing.create({name: "thing1"});

    this.store.pushArray("stuff", [{ id: "1", name: "stuff1"}, { id: "2", name: "stuff2"}]);

    assert.equal(thing1.get("observationCount"), 1);
});
