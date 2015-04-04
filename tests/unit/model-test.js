import Ember from "ember";
import { module, test } from 'qunit';
import { attr, Model } from "ember-cli-simple-store/model";

var Person, brandon;
var data = {id: 1, firstName: "Brandon", lastName: "Williams"};

module("model unit tests", {
    setup: function() {
        Person = Model.extend({
            wat: "",
            firstName: attr(),
            lastName: attr(),
            fullName: function() {
                var first = this.get("firstName");
                var last = this.get("lastName");
                return first + " " + last;
            }.property("firstName", "lastName")
        });
    }
});

test("attr will serve as both gettr and settr", function(assert){
    brandon = Person.create(data);
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal("Williams", brandon.get("lastName"));
    assert.equal("Brandon Williams", brandon.get("fullName"));
    brandon.set("firstName", "x");
    brandon.set("lastName", "y");
    assert.equal("x", brandon.get("firstName"));
    assert.equal("y", brandon.get("lastName"));
    assert.equal("x y", brandon.get("fullName"));
});

test("isDirty property on class will update if attr is changed", function(assert){
    brandon = Person.create(data);
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("isDirty"));
});

test("isDirty property on class will not update if non attr is changed", function(assert){
    brandon = Person.create(data);
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("wat", "baz");
    assert.equal(false, brandon.get("isDirty"));
});

test("save will reset isDirty", function(assert){
    brandon = Person.create(data);
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("isDirty"));
    brandon.save();
    assert.equal(false, brandon.get("isDirty"));
    assert.equal("baz", brandon.get("firstName"));
});

test("save will update internal state", function(assert){
    brandon = Person.create(data);
    var preState = brandon.get("_oldState");
    assert.equal(2, Object.keys(preState).length);
    assert.equal(undefined, preState["firstName"]);
    assert.equal(undefined, preState["lastName"]);

    brandon.set("firstName", "baz");
    var initState = brandon.get("_oldState");
    assert.equal(2, Object.keys(initState).length);
    assert.equal("Brandon", initState["firstName"]);
    assert.equal("Williams", initState["lastName"]);

    brandon.save();
    var postState = brandon.get("_oldState");
    assert.equal(2, Object.keys(postState).length);
    assert.equal("baz", postState["firstName"]);
    assert.equal("Williams", postState["lastName"]);
});

test("rollback will reset isDirty", function(assert){
    brandon = Person.create(data);
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("isDirty"));
    brandon.rollback();
    assert.equal(false, brandon.get("isDirty"));
    assert.equal("Brandon", brandon.get("firstName"));
});

test("rollback will revert internal state", function(assert){
    brandon = Person.create(data);
    var preState = brandon.get("_oldState");
    assert.equal(2, Object.keys(preState).length);
    assert.equal(undefined, preState["firstName"]);
    assert.equal(undefined, preState["lastName"]);

    brandon.set("firstName", "baz");
    var initState = brandon.get("_oldState");
    assert.equal(2, Object.keys(initState).length);
    assert.equal("Brandon", initState["firstName"]);
    assert.equal("Williams", initState["lastName"]);

    brandon.rollback();
    var postState = brandon.get("_oldState");
    assert.equal(2, Object.keys(postState).length);
    assert.equal("Brandon", postState["firstName"]);
    assert.equal("Williams", postState["lastName"]);
});

test("rollback after it has been saved will be a no-op", function(assert){
    brandon = Person.create(data);
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("isDirty"));
    brandon.set("firstName", "wat");
    assert.equal(true, brandon.get("isDirty"));
    brandon.save();
    assert.equal(false, brandon.get("isDirty"));
    assert.equal("wat", brandon.get("firstName"));
    brandon.rollback();
    assert.equal(false, brandon.get("isDirty"));
    assert.equal("wat", brandon.get("firstName"));
});

test("internal state will be only set the first time a property is set", function(assert){
    brandon = Person.create(data);
    var preState = brandon.get("_oldState");
    assert.equal(2, Object.keys(preState).length);
    assert.equal(undefined, preState["firstName"]);
    assert.equal(undefined, preState["lastName"]);

    brandon.set("firstName", "baz");
    var initState = brandon.get("_oldState");
    assert.equal(2, Object.keys(initState).length);
    assert.equal("Brandon", initState["firstName"]);
    assert.equal("Williams", initState["lastName"]);
    brandon.set("_oldState.firstName", "nogo");
    brandon.set("_oldState.lastName", "nope");

    brandon.set("firstName", "baz");
    var postState = brandon.get("_oldState");
    assert.equal(2, Object.keys(postState).length);
    assert.equal("nogo", postState["firstName"]);
    assert.equal("nope", postState["lastName"]);
});

test("isDirty on the individual property will update if attr is changed", function(assert){
    brandon = Person.create(data);
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal("Williams", brandon.get("lastName"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("lastNameIsDirty"));
    brandon.set("lastName", "wat");
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(true, brandon.get("lastNameIsDirty"));
});

test("isDirty on the individual property is reset after save", function(assert){
    brandon = Person.create(data);
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("firstNameIsDirty"));
    brandon.save();
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
});

test("isDirty on the model is reset only after all values set back to original values", function(assert){
    brandon = Person.create(data);
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal("Williams", brandon.get("lastName"));
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "foo");
    brandon.set("lastName", "bar");
    assert.equal(true, brandon.get("isDirty"));
    brandon.set("firstName", "Brandon");
    assert.equal(true, brandon.get("isDirty"));
    brandon.set("lastName", "Williams");
    assert.equal(false, brandon.get("isDirty"));
});

test("isDirty on the model is reset after value set back to original value", function(assert){
    brandon = Person.create(data);
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("isDirty"));
    brandon.set("firstName", "Brandon");
    assert.equal(false, brandon.get("isDirty"));
});

test("isDirty on the model is reset when original value is empty string and set back to empty string", function(assert){
    brandon = Person.create({id: 1, firstName: "", lastName: "Williams"});
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("isDirty"));
    brandon.set("firstName", "");
    assert.equal(false, brandon.get("isDirty"));
});

test("isDirty on the model is reset when original value is undefined and set back to undefined", function(assert){
    brandon = Person.create({id: 1, firstName: undefined, lastName: "Williams"});
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("isDirty"));
    brandon.set("firstName", undefined);
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "");
    assert.equal(false, brandon.get("isDirty"));
});

test("isDirty on the model is reset when original value is null and set back to null", function(assert){
    brandon = Person.create({id: 1, firstName: null, lastName: "Williams"});
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("isDirty"));
    brandon.set("firstName", null);
    assert.equal(false, brandon.get("isDirty"));
});

test("isDirty on the model is reset when original value is 0 and set back to 0", function(assert){
    brandon = Person.create({id: 1, firstName: 0, lastName: "Williams"});
    assert.equal(0, brandon.get("firstName"));
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("isDirty"));
    brandon.set("firstName", 0);
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "0");
    assert.equal(true, brandon.get("isDirty"));
});

test("isDirty on the individual property is reset after value set back to original value", function(assert){
    brandon = Person.create(data);
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("firstNameIsDirty"));
    brandon.set("firstName", "Brandon");
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
});

test("isDirty on the individual property is reset after rollback", function(assert){
    brandon = Person.create(data);
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("firstNameIsDirty"));
    brandon.rollback();
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
});

test("rollback after it has been saved will be a no-op at the property level also", function(assert){
    brandon = Person.create(data);
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("firstNameIsDirty"));
    brandon.save();
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal("baz", brandon.get("firstName"));
    brandon.rollback();
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal("baz", brandon.get("firstName"));
});

test("a prime of the attr with an empty string will not alter the dirty state", function(assert) {
    brandon = Person.create();
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    brandon.set("firstName", "");
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
});

test("a prime of the attr with a legit value will alter the dirty state", function(assert) {
    brandon = Person.create();
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    brandon.set("firstName", "x");
    assert.equal("x", brandon.get("firstName"));
    assert.equal(true, brandon.get("isDirty"));
    assert.equal(true, brandon.get("firstNameIsDirty"));
});

test("isDirty is smart enough to know when the attr has been restored", function(assert){
    brandon = Person.create(data);
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("firstNameIsDirty"));
    assert.equal("baz", brandon.get("firstName"));
    brandon.set("firstName", "Brandon");
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
});
