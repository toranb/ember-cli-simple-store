import { computed } from '@ember/object';
import { module, test } from 'qunit';
import { attr, Model } from "ember-cli-simple-store/model";

var Person, brandon;
var data = {id: 1, firstName: "Brandon", lastName: "Williams"};

module("model unit tests", {
    beforeEach: function() {
        Person = Model.extend({
            wat: "",
            firstName: attr(),
            lastName: attr(),
            fullName: computed(function() {
                var first = this.get("firstName");
                var last = this.get("lastName");
                return first + " " + last;
            }).property("firstName", "lastName")
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

test("isNotDirty property on class will reflect the inverse of isDirty computed", function(assert){
    brandon = Person.create(data);
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(true, brandon.get("isNotDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("isDirty"));
    assert.equal(false, brandon.get("isNotDirty"));
    brandon.set("firstName", "Brandon");
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(true, brandon.get("isNotDirty"));
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
    assert.equal("Brandon", preState["firstName"]);
    assert.equal("Williams", preState["lastName"]);

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

test("rollback will not alter the internal state", function(assert){
    brandon = Person.create(data);
    var preState = brandon.get("_oldState");
    assert.equal(2, Object.keys(preState).length);
    assert.equal("Brandon", preState["firstName"]);
    assert.equal("Williams", preState["lastName"]);

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
    assert.equal("Brandon", preState["firstName"]);
    assert.equal("Williams", preState["lastName"]);

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
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal(undefined, brandon.get("lastNameIsDirty"));
    assert.equal(undefined, brandon.get("lastNameIsPrimed"));
    brandon.set("lastName", "wat");
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal(true, brandon.get("lastNameIsDirty"));
    assert.equal(true, brandon.get("lastNameIsPrimed"));
});

test("isDirty on the individual property is reset after save", function(assert){
    brandon = Person.create(data);
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("firstNameIsDirty"));
    assert.equal(true, brandon.get("firstNameIsPrimed"));
    brandon.save();
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
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

test("isDirty on the model is updated when value is empty string and later set to undefined", function(assert){
    brandon = Person.create({id: 1, firstName: "", lastName: "Williams"});
    assert.equal("", brandon.get("firstName"));
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("isDirty"));
    brandon.set("firstName", "");
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", undefined);
    assert.equal(true, brandon.get("isDirty"));
});

test("isDirty on the model is updated when value is undefined then set to undefined and later empty string", function(assert){
    brandon = Person.create({id: 1, firstName: undefined, lastName: "Williams"});
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("isDirty"));
    brandon.set("firstName", undefined);
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "");
    assert.equal(true, brandon.get("isDirty"));
});

test("isDirty on the model is updated when value is null then set to empty string and later null", function(assert){
    brandon = Person.create({id: 1, firstName: null, lastName: "Williams"});
    assert.equal(null, brandon.get("firstName"));
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("isDirty"));
    brandon.set("firstName", "");
    assert.equal(true, brandon.get("isDirty"));
    brandon.set("firstName", null);
    assert.equal(false, brandon.get("isDirty"));
});

test("isDirty on the model is updated when value is undefined then set to empty string and later undefined", function(assert){
    brandon = Person.create({id: 1, firstName: undefined, lastName: "Williams"});
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("isDirty"));
    brandon.set("firstName", "");
    assert.equal(true, brandon.get("isDirty"));
    brandon.set("firstName", undefined);
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
    assert.equal(undefined, brandon.get("firstName"));
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
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("firstNameIsDirty"));
    assert.equal(true, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "Brandon");
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(true, brandon.get("firstNameIsPrimed"));
});

test("isDirty on the individual property is reset after rollback", function(assert){
    brandon = Person.create(data);
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("firstNameIsDirty"));
    assert.equal(true, brandon.get("firstNameIsPrimed"));
    brandon.rollback();
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
});

test("rollback after it has been saved will be a no-op at the property level also", function(assert){
    brandon = Person.create(data);
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("firstNameIsDirty"));
    assert.equal(true, brandon.get("firstNameIsPrimed"));
    brandon.save();
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal("baz", brandon.get("firstName"));
    brandon.rollback();
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal("baz", brandon.get("firstName"));
});

test("a prime of the attr with an empty string will alter isDirty but not isPrimed", function(assert) {
    brandon = Person.create();
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "");
    assert.equal("", brandon.get("firstName"));
    assert.equal(true, brandon.get("isDirty"));
    assert.equal(true, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
});

test("a prime of the attr with a non empty string will alter both isDirty and isPrimed", function(assert) {
    brandon = Person.create();
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "x");
    assert.equal("x", brandon.get("firstName"));
    assert.equal(true, brandon.get("isDirty"));
    assert.equal(true, brandon.get("firstNameIsDirty"));
    assert.equal(true, brandon.get("firstNameIsPrimed"));
});

test("isDirty is smart enough to know when the attr has been restored", function(assert){
    brandon = Person.create(data);
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "baz");
    assert.equal(true, brandon.get("firstNameIsDirty"));
    assert.equal(true, brandon.get("firstNameIsPrimed"));
    assert.equal("baz", brandon.get("firstName"));
    brandon.set("firstName", "Brandon");
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(true, brandon.get("firstNameIsPrimed"));
});

test("rolling back a model with no changes is a no-op", function(assert){
    brandon = Person.create(data);
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal("Williams", brandon.get("lastName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal(undefined, brandon.get("lastNameIsDirty"));
    assert.equal(undefined, brandon.get("lastNameIsPrimed"));

    brandon.rollback();
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal("Williams", brandon.get("lastName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal(undefined, brandon.get("lastNameIsDirty"));
    assert.equal(undefined, brandon.get("lastNameIsPrimed"));
});

test("saving a model with no changes is a no-op", function(assert){
    brandon = Person.create(data);
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal("Williams", brandon.get("lastName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal(undefined, brandon.get("lastNameIsDirty"));
    assert.equal(undefined, brandon.get("lastNameIsPrimed"));

    brandon.save();
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal("Williams", brandon.get("lastName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal(undefined, brandon.get("lastNameIsDirty"));
    assert.equal(undefined, brandon.get("lastNameIsPrimed"));
});

test("rolling back a model after initial state is modified should revert to original value", function(assert){
    brandon = Person.create(data);
    assert.equal("Brandon", brandon.get("firstName"));
    brandon.set("firstName", "");
    assert.equal("", brandon.get("firstName"));
    brandon.rollback();
    assert.equal("Brandon", brandon.get("firstName"));
    brandon.set("firstName", undefined);
    assert.equal(undefined, brandon.get("firstName"));
    brandon.rollback();
    assert.equal("Brandon", brandon.get("firstName"));
    brandon.set("firstName", null);
    assert.equal(null, brandon.get("firstName"));
    brandon.rollback();
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal("Williams", brandon.get("lastName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal(undefined, brandon.get("lastNameIsDirty"));
    assert.equal(undefined, brandon.get("lastNameIsPrimed"));
});

test("rolling back a model after initial state is modified should revert to original value when array", function(assert){
    var Beast = Model.extend({things: attr()});
    var beast = Beast.create({id: 1, things: [1, 2]});
    assert.deepEqual([1, 2], beast.get("things"));
    beast.set("things", [1]);
    assert.equal(true, beast.get("isDirty"));
    assert.deepEqual([1], beast.get("things"));
    assert.equal(true, beast.get("thingsIsDirty"));
    assert.equal(true, beast.get("thingsIsPrimed"));
    beast.rollback();
    assert.equal(false, beast.get("isDirty"));
    assert.deepEqual([1, 2], beast.get("things"));
    assert.equal(undefined, beast.get("thingsIsDirty"));
    assert.equal(undefined, beast.get("thingsIsPrimed"));
    beast.set("things", undefined);
    assert.equal(true, beast.get("isDirty"));
    assert.equal(undefined, beast.get("things"));
    assert.equal(true, beast.get("thingsIsDirty"));
    assert.equal(true, beast.get("thingsIsPrimed"));
    beast.rollback();
    assert.equal(false, beast.get("isDirty"));
    assert.deepEqual([1, 2], beast.get("things"));
    assert.equal(undefined, beast.get("thingsIsDirty"));
    assert.equal(undefined, beast.get("thingsIsPrimed"));
    beast.set("things", null);
    assert.equal(true, beast.get("isDirty"));
    assert.equal(null, beast.get("things"));
    assert.equal(true, beast.get("thingsIsDirty"));
    assert.equal(true, beast.get("thingsIsPrimed"));
    beast.rollback();
    assert.equal(false, beast.get("isDirty"));
    assert.deepEqual([1, 2], beast.get("things"));
    assert.equal(false, beast.get("isDirty"));
    assert.equal(undefined, beast.get("thingsIsDirty"));
    assert.equal(undefined, beast.get("thingsIsPrimed"));
});

test("rolling back and saving a new model with no changes is a no-op", function(assert){
    brandon = Person.create();
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(undefined, brandon.get("lastName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal(undefined, brandon.get("lastNameIsDirty"));
    assert.equal(undefined, brandon.get("lastNameIsPrimed"));
    brandon.set("firstName", "wat");

    brandon.rollback();
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(undefined, brandon.get("lastName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal(undefined, brandon.get("lastNameIsDirty"));
    assert.equal(undefined, brandon.get("lastNameIsPrimed"));

    brandon.save();
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(undefined, brandon.get("lastName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal(undefined, brandon.get("lastNameIsDirty"));
    assert.equal(undefined, brandon.get("lastNameIsPrimed"));

    brandon.set("firstName", "wat");
    brandon.save();
    assert.equal("wat", brandon.get("firstName"));
    assert.equal(undefined, brandon.get("lastName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal(undefined, brandon.get("lastNameIsDirty"));
    assert.equal(undefined, brandon.get("lastNameIsPrimed"));
});

test("saving and rolling back a new model immediately is a no-op", function(assert){
    brandon = Person.create();
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(undefined, brandon.get("lastName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal(undefined, brandon.get("lastNameIsDirty"));
    assert.equal(undefined, brandon.get("lastNameIsPrimed"));

    brandon.set("firstName", "Brandon");
    brandon.set("lastName", "Williams");
    brandon.save();
    brandon.rollback();
    assert.equal("Brandon", brandon.get("firstName"));
    assert.equal("Williams", brandon.get("lastName"));
    assert.equal(false, brandon.get("isDirty"));
    assert.equal(undefined, brandon.get("firstNameIsDirty"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    assert.equal(undefined, brandon.get("lastNameIsDirty"));
    assert.equal(undefined, brandon.get("lastNameIsPrimed"));
});

test("isDirty and isPrimed are true if the values are cleared out", function(assert){
    brandon = Person.create({id: 1, firstName: "x"});
    assert.equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "");
    assert.equal(true, brandon.get("isDirty"));
    assert.equal(true, brandon.get("firstNameIsDirty"));
    assert.equal(true, brandon.get("firstNameIsPrimed"));
});

test("isPrimed is undefined when attr is undefined and later set to empty string", function(assert){
    brandon = Person.create({id: 1, firstName: undefined, lastName: "Williams"});
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "");
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
});

test("isPrimed is true when attr is empty string and later set to undefined", function(assert){
    brandon = Person.create({id: 1, firstName: "", lastName: "Williams"});
    assert.equal("", brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", undefined);
    assert.equal(true, brandon.get("firstNameIsPrimed"));
    assert.equal(true, brandon.get("isDirty"));
});

test("isPrimed is true when attr is undefined and later set to valid string", function(assert){
    brandon = Person.create({id: 1, firstName: undefined, lastName: "Williams"});
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "");
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "x");
    assert.equal(true, brandon.get("firstNameIsPrimed"));
});

test("isPrimed is true when attr is undefined then string and again undefined", function(assert){
    brandon = Person.create({id: 1, firstName: undefined, lastName: "Williams"});
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "");
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "x");
    assert.equal(true, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", undefined);
    assert.equal(true, brandon.get("firstNameIsPrimed"));
});

test("isPrimed is undefined after save and rollback", function(assert){
    brandon = Person.create({id: 1, firstName: undefined, lastName: "Williams"});
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "");
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "x");
    assert.equal(true, brandon.get("firstNameIsPrimed"));
    brandon.save();
    assert.equal("x", brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "xe");
    assert.equal(true, brandon.get("firstNameIsPrimed"));
    brandon.rollback();
    assert.equal("x", brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
});

test("isPrimed is undefined after save and rollback on new object", function(assert){
    brandon = Person.create();
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.rollback();
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
    brandon.save();
    assert.equal(undefined, brandon.get("firstName"));
    assert.equal(undefined, brandon.get("firstNameIsPrimed"));
});

test("isPrimed is null after save and rollback (starting with null value)", function(assert){
    brandon = Person.create({id: 1, firstName: null, lastName: "Williams"});
    assert.equal(null, brandon.get("firstName"));
    assert.equal(null, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "");
    assert.equal(null, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "x");
    assert.equal(true, brandon.get("firstNameIsPrimed"));
    brandon.save();
    assert.equal("x", brandon.get("firstName"));
    assert.equal(null, brandon.get("firstNameIsPrimed"));
    brandon.set("firstName", "xe");
    assert.equal(true, brandon.get("firstNameIsPrimed"));
    brandon.rollback();
    assert.equal("x", brandon.get("firstName"));
    assert.equal(null, brandon.get("firstNameIsPrimed"));
});
