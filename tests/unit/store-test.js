import Ember from "ember";
import { module, test } from 'qunit';
import Store from "ember-cli-simple-store/store";

var store, Person, Cat;

module("store unit tests", {
  setup: function() {
    Person = Ember.Object.extend({
        firstName: "",
        lastName: "",
        cat_id: null
    });
    Cat = Ember.Object.extend({
        color: ""
    });
    var container = new Ember.Container();
    this.container = container;
    container.register("store:main", Store);
    container.register("model:person", Person);
    container.register("model:cat", Cat);
    store = container.lookup("store:main");
  }
});

test("records can be pushed into the store", function(assert) {
  store.push("person", {
    id: "toranb",
    firstName: "Toran",
    lastName: "Billups"
  });

  var toranb = store.find("person", "toranb");
  assert.ok(toranb, "The toranb record was found");

  assert.equal(toranb.get("firstName"), "Toran", "the firstName property is correct");
  assert.equal(toranb.get("lastName"), "Billups", "the lastName property is correct");
  assert.equal(toranb.get("id"), "toranb", "the id property is correct");
});

test("push returns the created record", function(assert) {
  var pushedToranb = store.push("person", {
    id: "toranb",
    firstName: "Toran",
    lastName: "Billups"
  });

  var gottenToranb = store.find("person", "toranb");

  assert.strictEqual(pushedToranb, gottenToranb, "both records are identical");
});

test("pushing a record into the store twice updates the original record", function(assert) {
  store.push("person", {
    id: "toranb",
    firstName: "Toran",
    lastName: "Billups"
  });

  var toranb = store.find("person", "toranb");
  assert.ok(toranb, "The toranb record was found");

  assert.equal(toranb.get("firstName"), "Toran", "the firstName property is correct");
  assert.equal(toranb.get("lastName"), "Billups", "the lastName property is correct");
  assert.equal(toranb.get("id"), "toranb", "the id property is correct");

  store.push("person", {
    id: "toranb",
    firstName: "X",
    lastName: "Y"
  });

  assert.equal(toranb.get("firstName"), "X", "the firstName property is correct");
  assert.equal(toranb.get("lastName"), "Y", "the lastName property is correct");
  assert.equal(toranb.get("id"), "toranb", "the id property is is correct");
});

test("pushing doesn't mangle string ids", function(assert) {
  store.push("person", {
    id: "toranb",
    firstName: "Toran",
    lastName: "Billups"
  });

  var toranb = store.find("person", "toranb");
  assert.strictEqual(toranb.get("id"), "toranb");
});

test("models with int based ids can be lookedup by either str or int values", function(assert) {
  store.push("person", {
    id: 123,
    firstName: "Toran",
    lastName: "Billups"
  });

  var toranbByStr = store.find("person", "123");
  assert.strictEqual(toranbByStr.get("id"), 123);
  assert.ok(toranbByStr instanceof Person);

  var toranbByNum = store.find("person", 123);
  assert.strictEqual(toranbByNum.get("id"), 123);
  assert.ok(toranbByNum instanceof Person);
});

test("find should return array of models", function(assert) {
  store.push("person", {
    id: 1,
    firstName: "Toran",
    lastName: "Billups"
  });

  store.push("person", {
    id: 2,
    firstName: "Brandon",
    lastName: "Williams"
  });

  assert.equal(store.find("person").length, 2);
  assert.equal(store.find("person")[0].get("firstName"), "Toran");
  assert.equal(store.find("person")[1].get("firstName"), "Brandon");
});

test("remove should destory the item by type", function(assert) {
  var first = store.push("person", {
    id: 1,
    firstName: "Toran",
    lastName: "Billups"
  });

  var last = store.push("person", {
    id: 2,
    firstName: "Brandon",
    lastName: "Williams"
  });

  assert.equal(store.find("person").length, 2);
  store.remove("person", first.get("id"));
  assert.equal(store.find("person").length, 1);

  var first_person = store.find("person", first.id);
  assert.ok(!first_person, "The toran record was still found");

  var last_person = store.find("person", last.id);
  assert.ok(last_person, "The brandon record was not found");
});

test("find with filter should return array of models filtered by value", function(assert) {
  store.push("person", {
    id: 9,
    firstName: "Jarrod",
    lastName: "Taylor",
    cat_id: 1
  });

  store.push("person", {
    id: 8,
    firstName: "Brandon",
    lastName: "Williams",
    cat_id: 2
  });

  store.push("person", {
    id: 7,
    firstName: "Toran",
    lastName: "Billups",
    cat_id: 1
  });

  store.push("cat", {
    id: 1,
    color: "red"
  });

  store.push("cat", {
    id: 2,
    color: "blue"
  });

  assert.equal(store.find("person").length, 3);
  assert.equal(store.find("person")[0].get("cat_id"), 1);
  assert.equal(store.find("person")[1].get("cat_id"), 2);
  assert.equal(store.find("person")[2].get("cat_id"), 1);

  assert.equal(store.find("person", {cat_id: 1}).get("length"), 2);
  assert.equal(store.find("person", {cat_id: 2}).get("length"), 1);

  store.push("person", {
      id: 14,
      firstName: "wat",
      lastName: "hat",
      cat_id: 1
  });
  assert.equal(store.find("person", {cat_id: 1}).get("length"), 3);
  assert.equal(store.find("person", {cat_id: 2}).get("length"), 1);

  store.push("person", {
      id: 15,
      firstName: "xor",
      lastName: "nope",
      cat_id: 2
  });
  assert.equal(store.find("person", {cat_id: 2}).get("length"), 2);
  assert.equal(store.find("person", {cat_id: 1}).get("length"), 3);

  assert.equal(store.find("person").length, 5);
});

test("find with filter should return array of models that tracks changes without asking for an update", function(assert) {
  store.push("person", {
    id: 9,
    firstName: "Brandon",
    lastName: "Williams",
    cat_id: 1
  });

  store.push("person", {
    id: 8,
    firstName: "Toran",
    lastName: "Billups",
    cat_id: 1
  });

  store.push("cat", {
    id: 1,
    color: "red"
  });

  var firstBoundProperty = store.find("person", {cat_id: 1});
  assert.equal(firstBoundProperty.get("length"), 2);

  store.push("person", {
      id: 14,
      firstName: "Another",
      lastName: "Person",
      cat_id: 1
  });

  assert.equal(firstBoundProperty.get("length"), 3);
});

test("find with filter works with string based values", function(assert) {
  store.push("person", {
    id: 9,
    firstName: "Jarrod",
    lastName: "Taylor",
    nickname: "foo"
  });

  store.push("person", {
    id: 8,
    firstName: "Brandon",
    lastName: "Williams",
    nickname: "bar"
  });

  store.push("person", {
    id: 7,
    firstName: "Toran",
    lastName: "Billups",
    nickname: "foo"
  });

  var foo_data = store.find("person", {nickname: "foo"});
  var bar_data = store.find("person", {nickname: "bar"});

  assert.equal(foo_data.get("length"), 2);
  assert.equal(bar_data.get("length"), 1);
  assert.equal(foo_data.objectAt(0).get("firstName"), "Jarrod");
  assert.equal(foo_data.objectAt(1).get("firstName"), "Toran");
  assert.equal(bar_data.objectAt(0).get("firstName"), "Brandon");
});

test("clear will destroy everything for a given type", function(assert) {
  store.push("person", {
    id: 9,
    firstName: "Brandon",
    lastName: "Williams",
    cat_id: 1
  });

  store.push("person", {
    id: 8,
    firstName: "Toran",
    lastName: "Billups",
    cat_id: 1
  });

  store.push("cat", {
    id: 1,
    color: "red"
  });

  var catBefore = store.find("cat", 1);
  assert.equal(catBefore.get("color"), "red");

  var catsBefore = store.find("cat");
  assert.equal(catsBefore.get("length"), 1);

  var firstBoundProperty = store.find("person", {cat_id: 1});
  assert.equal(firstBoundProperty.get("length"), 2);

  var individualFirstBefore = store.find("person", 9);
  assert.equal(individualFirstBefore.get("firstName"), "Brandon");

  var individualLastBefore = store.find("person", 8);
  assert.equal(individualLastBefore.get("firstName"), "Toran");

  store.clear("person");

  assert.equal(firstBoundProperty.get("length"), 0);

  var all = store.find("person");
  assert.equal(all.get("length"), 0);

  var individualFirstAfter = store.find("person", 9);
  assert.equal(individualFirstAfter, null);

  var individualLastAfter = store.find("person", 8);
  assert.equal(individualLastAfter, null);

  var catAfter = store.find("cat", 1);
  assert.equal(catAfter.get("color"), "red");

  var catsAfter = store.find("cat");
  assert.equal(catsAfter.get("length"), 1);
});

test("clear without type will destroy everything", function(assert) {
  store.push("person", {
    id: 9,
    firstName: "Brandon",
    lastName: "Williams",
    cat_id: 1
  });

  store.push("person", {
    id: 8,
    firstName: "Toran",
    lastName: "Billups",
    cat_id: 1
  });

  store.push("cat", {
    id: 1,
    color: "red"
  });

  assert.equal(store.find("person").get("length"), 2);
  assert.equal(store.find("cat").get("length"), 1);

  store.clear();

  assert.equal(store.find("person").get("length"), 0);
  assert.equal(store.find("cat").get("length"), 0);
});

test("find with filter should raise clear exception when invalid options are passed", function(assert) {
    try {
        store.find("person", {});
        assert.ok(false, "filter did not fail with clear exception message");
    } catch(e) {
        assert.equal(e.message, "Assertion Failed: No key was found in the filter options");
    }
});

test("pushing a model that does not exist should raise clear exception", function(assert) {
    try {
        store.push("goat", {id: 4, name: "billy"});
        assert.ok(false, "model lookup did not fail with clear exception message");
    } catch(e) {
        assert.equal(e.message, "Assertion Failed: No model was found for type: goat");
    }
});

test("findOne will return the first record", function(assert) {
  var first = store.push("person", {
    id: 1,
    firstName: "Toran",
    lastName: "Billups"
  });

  var last = store.push("person", {
    id: 2,
    firstName: "Brandon",
    lastName: "Williams"
  });

  assert.equal(store.find("person").length, 2);

  var toranb = store.findOne("person");
  assert.equal(toranb.get("firstName"), "Toran", "the firstName property is correct");
  assert.equal(toranb.get("lastName"), "Billups", "the lastName property is correct");
  assert.equal(toranb.get("id"), "1", "the id property is correct");
});

test("findOne should return null when no objects exist in the cache for given type", function(assert) {
    assert.equal(store.find("person").length, 0);
    var person = store.findOne("person");
    assert.deepEqual(person, null);
});

test("find with filter function will return bound array", function(assert) {
  store.push("person", {
    id: 9,
    firstName: "Jarrod",
    lastName: "Taylor",
    nickname: "foo",
    group: 2
  });

  store.push("person", {
    id: 8,
    firstName: "Brandon",
    lastName: "Williams",
    nickname: "bar",
    group: 3
  });

  store.push("person", {
    id: 7,
    firstName: "Toran",
    lastName: "Billups",
    nickname: "foo",
    group: 8
  });

  var filter = function(person) {
      return person.get("group") > 2 || person.get("nickname") === "bar";
  };

  var filtered_data = store.find("person", filter, ["group", "nickname"]);

  assert.equal(filtered_data.get("length"), 2);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Toran");

  store.push("person", {
    id: 6,
    firstName: "Taylor",
    lastName: "Hobbs",
    nickname: "zzz",
    group: 8
  });

  assert.equal(filtered_data.get("length"), 3);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Toran");
  assert.equal(filtered_data.objectAt(2).get("firstName"), "Taylor");

  store.push("person", {
    id: 5,
    firstName: "Matt",
    lastName: "Morrison",
    nickname: "bar",
    group: 0
  });

  assert.equal(filtered_data.get("length"), 4);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Toran");
  assert.equal(filtered_data.objectAt(2).get("firstName"), "Taylor");
  assert.equal(filtered_data.objectAt(3).get("firstName"), "Matt");

  var taylor = store.find("person", 6);
  assert.equal(taylor.get("firstName"), "Taylor");
  taylor.set("group", 1);

  assert.equal(filtered_data.get("length"), 3);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Toran");
  assert.equal(filtered_data.objectAt(2).get("firstName"), "Matt");

  var brandon = store.find("person", 8);
  assert.equal(brandon.get("firstName"), "Brandon");
  brandon.set("group", 1);

  assert.equal(filtered_data.get("length"), 3);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Toran");
  assert.equal(filtered_data.objectAt(2).get("firstName"), "Matt");

  brandon.set("nickname", "x");

  assert.equal(filtered_data.get("length"), 2);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Toran");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Matt");
});

test("doing a filter by function with no computed_keys should raise clear exception", function(assert) {
    try {
        store.push("person", {id: 1, name: "Matt"});
        var name_filter = function(person) {
            return person.get("name") === "Matt";
        };
        var filtered_data = store.find("person", name_filter);
        assert.ok(false, "find with filter did not fail with clear exception message");
    } catch(e) {
        assert.equal(e.message, "Assertion Failed: No computed keys found for the filter by function");
    }
});

