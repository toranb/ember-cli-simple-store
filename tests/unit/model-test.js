import Ember from "ember";
import { test, moduleFor } from "ember-qunit";
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

test("attr will serve as both gettr and settr", function(){
    brandon = Person.create(data);
    equal("Brandon", brandon.get("firstName"));
    equal("Williams", brandon.get("lastName"));
    equal("Brandon Williams", brandon.get("fullName"));
    brandon.set("firstName", "x");
    brandon.set("lastName", "y");
    equal("x", brandon.get("firstName"));
    equal("y", brandon.get("lastName"));
    equal("x y", brandon.get("fullName"));
});

test("isDirty property on class will update if attr is changed", function(){
    brandon = Person.create(data);
    equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    equal(true, brandon.get("isDirty"));
});

test("isDirty property on class will not update if non attr is changed", function(){
    brandon = Person.create(data);
    equal(false, brandon.get("isDirty"));
    brandon.set("wat", "baz");
    equal(false, brandon.get("isDirty"));
});

test("save will reset isDirty", function(){
    brandon = Person.create(data);
    equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    equal(true, brandon.get("isDirty"));
    brandon.save();
    equal(false, brandon.get("isDirty"));
    equal("baz", brandon.get("firstName"));
});

test("save will update internal state", function(){
    brandon = Person.create(data);
    var preState = brandon.get("_oldState");
    equal(2, Object.keys(preState).length);
    equal("", preState["firstName"]);
    equal("", preState["lastName"]);

    brandon.set("firstName", "baz");
    var initState = brandon.get("_oldState");
    equal(2, Object.keys(initState).length);
    equal("Brandon", initState["firstName"]);
    equal("Williams", initState["lastName"]);

    brandon.save();
    var postState = brandon.get("_oldState");
    equal(2, Object.keys(postState).length);
    equal("baz", postState["firstName"]);
    equal("Williams", postState["lastName"]);
});

test("rollback will reset isDirty", function(){
    brandon = Person.create(data);
    equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    equal(true, brandon.get("isDirty"));
    brandon.rollback();
    equal(false, brandon.get("isDirty"));
    equal("Brandon", brandon.get("firstName"));
});

test("rollback will revert internal state", function(){
    brandon = Person.create(data);
    var preState = brandon.get("_oldState");
    equal(2, Object.keys(preState).length);
    equal("", preState["firstName"]);
    equal("", preState["lastName"]);

    brandon.set("firstName", "baz");
    var initState = brandon.get("_oldState");
    equal(2, Object.keys(initState).length);
    equal("Brandon", initState["firstName"]);
    equal("Williams", initState["lastName"]);

    brandon.rollback();
    var postState = brandon.get("_oldState");
    equal(2, Object.keys(postState).length);
    equal("Brandon", postState["firstName"]);
    equal("Williams", postState["lastName"]);
});

test("rollback after it has been saved will be a no-op", function(){
    brandon = Person.create(data);
    equal(false, brandon.get("isDirty"));
    brandon.set("firstName", "baz");
    equal(true, brandon.get("isDirty"));
    brandon.set("firstName", "wat");
    equal(true, brandon.get("isDirty"));
    brandon.save();
    equal(false, brandon.get("isDirty"));
    equal("wat", brandon.get("firstName"));
    brandon.rollback();
    equal(false, brandon.get("isDirty"));
    equal("wat", brandon.get("firstName"));
});

test("internal state will be only set the first time a property is set", function(){
    brandon = Person.create(data);
    var preState = brandon.get("_oldState");
    equal(2, Object.keys(preState).length);
    equal("", preState["firstName"]);
    equal("", preState["lastName"]);

    brandon.set("firstName", "baz");
    var initState = brandon.get("_oldState");
    equal(2, Object.keys(initState).length);
    equal("Brandon", initState["firstName"]);
    equal("Williams", initState["lastName"]);
    brandon.set("_oldState.firstName", "nogo");
    brandon.set("_oldState.lastName", "nope");

    brandon.set("firstName", "baz");
    var postState = brandon.get("_oldState");
    equal(2, Object.keys(postState).length);
    equal("nogo", postState["firstName"]);
    equal("nope", postState["lastName"]);
});
