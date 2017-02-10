import Ember from "ember";
import {moduleFor} from "ember-qunit";
import {test} from "dummy/tests/helpers/qunit";

const {getOwner} = Ember;

var store, Thing, Stuff;

moduleFor("service:simple-store", "arrays unit tests", {
    beforeEach: function () {
        const owner = getOwner(this);
        store = this.subject();
        Stuff = Ember.Object.extend();

        Thing = Ember.Object.extend({
            observationCount: 0,
            name: "",
            stuff: store.find("stuff"),
            observeStuff: Ember.observer("stuff.[]", function () {
                var currentObservations = this.get("observationCount");
                this.set("observationCount", currentObservations + 1);
            })
        });
        owner.register("model:stuff", Stuff);
    }
});

test("observers are only notified once regardless of the number of models added to the store", function (assert) {
    var thing1 = Thing.create({name: "thing1"});

    store.pushArray("stuff", [{ id: "1", name: "stuff1"}, { id: "2", name: "stuff2"}]);

    assert.equal(thing1.get("observationCount"), 1);
});
