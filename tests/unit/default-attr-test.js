import Ember from "ember";
import { module, test } from 'qunit';
import { attr, Model } from "ember-cli-simple-store/model";

var Animal, leopard;

module("default attr unit tests", {
    setup: function() {
        Animal = Model.extend({
            name: attr(""),
            fast: attr(false)
        });
    }
});

test("isDirty property on class will show correctly when set to default string value", function(assert){
    leopard = Animal.create({name: "toran", fast: true});
    assert.equal(false, leopard.get("isDirty"));
    leopard.set("name", "baz");
    assert.equal(true, leopard.get("isDirty"));
    assert.equal("baz", leopard.get("name"));
    leopard.set("name", "");
    assert.equal(true, leopard.get("isDirty"));
    assert.equal("", leopard.get("name"));
    assert.equal(true, leopard.get("nameIsDirty"));
    assert.equal(true, leopard.get("nameIsPrimed"));
});

test("isDirty property on class will show correctly when set to default boolean value", function(assert){
    leopard = Animal.create({name: "toran", fast: true});
    assert.equal(false, leopard.get("isDirty"));
    leopard.set("fast", false);
    assert.equal(true, leopard.get("isDirty"));
    assert.equal(false, leopard.get("fast"));
    assert.equal(true, leopard.get("fastIsDirty"));
    assert.equal(true, leopard.get("fastIsPrimed"));
});

test("save will reset isDirty", function(assert){
    leopard = Animal.create({name: "toran", fast: true});
    assert.equal(false, leopard.get("isDirty"));
    leopard.set("name", "baz");
    assert.equal(true, leopard.get("isDirty"));
    leopard.save();
    assert.equal(false, leopard.get("isDirty"));
    assert.equal("baz", leopard.get("name"));
});

test("rollback will reset isDirty for string attr with default value", function(assert){
    leopard = Animal.create({name: "toran", fast: true});
    assert.equal(false, leopard.get("isDirty"));
    leopard.set("name", "baz");
    assert.equal(true, leopard.get("isDirty"));
    leopard.rollback();
    assert.equal(false, leopard.get("isDirty"));
    assert.equal("toran", leopard.get("name"));
    leopard.set("name", "");
    assert.equal(true, leopard.get("isDirty"));
    leopard.rollback();
    assert.equal(false, leopard.get("isDirty"));
    assert.equal("toran", leopard.get("name"));
});

test("rollback will reset isDirty for boolean attr with default value", function(assert){
    leopard = Animal.create({name: "toran", fast: true});
    assert.equal(false, leopard.get("isDirty"));
    leopard.set("fast", false);
    assert.equal(true, leopard.get("isDirty"));
    leopard.rollback();
    assert.equal(false, leopard.get("isDirty"));
    assert.equal(true, leopard.get("fast"));
});

test("rollback after it has been saved will be a no-op", function(assert){
    leopard = Animal.create({name: "toran", fast: true});
    assert.equal(false, leopard.get("isDirty"));
    leopard.set("name", "baz");
    assert.equal(true, leopard.get("isDirty"));
    leopard.set("name", "wat");
    assert.equal(true, leopard.get("isDirty"));
    leopard.save();
    assert.equal(false, leopard.get("isDirty"));
    assert.equal("wat", leopard.get("name"));
    leopard.rollback();
    assert.equal(false, leopard.get("isDirty"));
    assert.equal("wat", leopard.get("name"));
});

test("isDirty on the model is reset only after all values set back to original values", function(assert){
    leopard = Animal.create({name: "toran", fast: true});
    assert.equal("toran", leopard.get("name"));
    assert.equal(true, leopard.get("fast"));
    assert.equal(false, leopard.get("isDirty"));
    leopard.set("name", "foo");
    leopard.set("fast", false);
    assert.equal(true, leopard.get("isDirty"));
    leopard.set("name", "toran");
    assert.equal(true, leopard.get("isDirty"));
    leopard.set("fast", true);
    assert.equal(false, leopard.get("isDirty"));
});

test("isDirty on the model is not reset when value is undefined and set to empty string", function(assert){
    leopard = Animal.create({name: undefined, fast: true});
    assert.equal(undefined, leopard.get("name"));
    assert.equal(false, leopard.get("isDirty"));
    leopard.set("name", "baz");
    assert.equal(true, leopard.get("isDirty"));
    leopard.set("name", undefined);
    assert.equal(false, leopard.get("isDirty"));
    leopard.set("name", "");
    assert.equal(false, leopard.get("isDirty"));
});

test("isDirty on the model is not reset when value is undefined and set to default boolean value", function(assert){
    leopard = Animal.create({name: "toran", fast: undefined});
    assert.equal(undefined, leopard.get("fast"));
    assert.equal(false, leopard.get("isDirty"));
    leopard.set("fast", true);
    assert.equal(true, leopard.get("isDirty"));
    leopard.set("fast", undefined);
    assert.equal(false, leopard.get("isDirty"));
    leopard.set("fast", false);
    assert.equal(false, leopard.get("isDirty"));
});

test("isDirty on the model is reset when value starts as empty array and set back to empty array value", function(assert){
    var Batman = Model.extend({batarangs: attr()});
    var watman = Batman.create({batarangs: []});
    assert.deepEqual([], watman.get("batarangs"));
    assert.equal(false, watman.get("isDirty"));
    watman.set("batarangs", [1, 2]);
    assert.equal(true, watman.get("isDirty"));
    watman.set("batarangs", []);
    assert.equal(false, watman.get("isDirty"));
    watman.set("batarangs", [3]);
    assert.equal(true, watman.get("isDirty"));
    watman.set("batarangs", []);
    assert.equal(false, watman.get("isDirty"));
});

test("isDirty on the model is reset when value starts as empty array and set back to empty array value and default value is empty array", function(assert){
    var Batman = Model.extend({batarangs: attr([])});
    var watman = Batman.create({batarangs: []});
    assert.deepEqual([], watman.get("batarangs"));
    assert.equal(false, watman.get("isDirty"));
    watman.set("batarangs", [1, 2]);
    assert.equal(true, watman.get("isDirty"));
    watman.set("batarangs", []);
    assert.equal(false, watman.get("isDirty"));
    watman.set("batarangs", [3]);
    assert.equal(true, watman.get("isDirty"));
    watman.set("batarangs", []);
    assert.equal(false, watman.get("isDirty"));
});

test("isDirty on the model is reset when value starts as undefined and set to default array value", function(assert){
    var Batman = Model.extend({batarangs: attr([])});
    var watman = Batman.create({batarangs: undefined});
    assert.equal(undefined, watman.get("batarangs"));
    assert.equal(false, watman.get("isDirty"));
    watman.set("batarangs", [1, 2]);
    assert.equal(true, watman.get("isDirty"));
    watman.set("batarangs", []);
    assert.equal(false, watman.get("isDirty"));
});

test("rolling back a model with no changes is a no-op", function(assert){
    leopard = Animal.create({name: "toran", fast: true});
    assert.equal("toran", leopard.get("name"));
    assert.equal(true, leopard.get("fast"));
    assert.equal(false, leopard.get("isDirty"));
    assert.equal(undefined, leopard.get("nameIsDirty"));
    assert.equal(undefined, leopard.get("nameIsPrimed"));
    assert.equal(undefined, leopard.get("fastIsDirty"));
    assert.equal(undefined, leopard.get("fastIsPrimed"));

    leopard.rollback();
    assert.equal("toran", leopard.get("name"));
    assert.equal(true, leopard.get("fast"));
    assert.equal(false, leopard.get("isDirty"));
    assert.equal(undefined, leopard.get("nameIsDirty"));
    assert.equal(undefined, leopard.get("nameIsPrimed"));
    assert.equal(undefined, leopard.get("fastIsDirty"));
    assert.equal(undefined, leopard.get("fastIsPrimed"));
});

test("rolling back and saving a new model with no changes is a no-op", function(assert){
    leopard = Animal.create();
    assert.equal(undefined, leopard.get("name"));
    assert.equal(undefined, leopard.get("fast"));
    assert.equal(false, leopard.get("isDirty"));
    assert.equal(undefined, leopard.get("nameIsDirty"));
    assert.equal(undefined, leopard.get("nameIsPrimed"));
    assert.equal(undefined, leopard.get("fastIsDirty"));
    assert.equal(undefined, leopard.get("fastIsPrimed"));
    leopard.set("name", "wat");

    leopard.rollback();
    assert.equal(undefined, leopard.get("name"));
    assert.equal(undefined, leopard.get("fast"));
    assert.equal(false, leopard.get("isDirty"));
    assert.equal(undefined, leopard.get("nameIsDirty"));
    assert.equal(undefined, leopard.get("nameIsPrimed"));
    assert.equal(undefined, leopard.get("fastIsDirty"));
    assert.equal(undefined, leopard.get("fastIsPrimed"));

    leopard.save();
    assert.equal(undefined, leopard.get("name"));
    assert.equal(undefined, leopard.get("fast"));
    assert.equal(false, leopard.get("isDirty"));
    assert.equal(undefined, leopard.get("nameIsDirty"));
    assert.equal(undefined, leopard.get("nameIsPrimed"));
    assert.equal(undefined, leopard.get("fastIsDirty"));
    assert.equal(undefined, leopard.get("fastIsPrimed"));

    leopard.set("name", "wat");
    leopard.save();
    assert.equal("wat", leopard.get("name"));
    assert.equal(undefined, leopard.get("fast"));
    assert.equal(false, leopard.get("isDirty"));
    assert.equal(undefined, leopard.get("nameIsDirty"));
    assert.equal(undefined, leopard.get("nameIsPrimed"));
    assert.equal(undefined, leopard.get("fastIsDirty"));
    assert.equal(undefined, leopard.get("fastIsPrimed"));
});

test("isDirty is true if the values are cleared out", function(assert){
    leopard = Animal.create({name: "toran", fast: true});
    assert.equal(false, leopard.get("isDirty"));
    leopard.set("name", "");
    assert.equal(true, leopard.get("isDirty"));
    leopard.set("name", "toran");
    assert.equal(false, leopard.get("isDirty"));
    leopard.set("fast", false);
    assert.equal(true, leopard.get("isDirty"));
    leopard.set("fast", true);
    assert.equal(false, leopard.get("isDirty"));
});
