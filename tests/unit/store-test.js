import Ember from "ember";
import getOwner from "ember-getowner-polyfill";
import { moduleFor } from "ember-qunit";
import { test } from "dummy/tests/helpers/qunit";

var store, Person, Toran, Cat, run = Ember.run;

moduleFor("service:simple-store", "store unit tests", {
  beforeEach: function() {
    Person = Ember.Object.extend({
        firstName: "",
        lastName: "",
        cat_id: null,
        demo: function() {
            var firstName = this.get("firstName");
            return firstName + " 777";
        }
    });
    Toran = Person.extend({
        fake: function() {
            var firstName = this.get("firstName");
            return firstName + " 999";
        }
    });
    Cat = Ember.Object.extend({
        color: ""
    });
    const owner = getOwner(this);
    store = this.subject();
    owner.register("model:person", Person);
    owner.register("model:toran", Toran);
    owner.register("model:cat", Cat);
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

  assert.strictEqual(pushedToranb, gottenToranb.get("content"), "both records are identical");
});

test("willDestroy sets refs to complex objects to null", function(assert) {
  store.push("person", {
    id: "gambler",
    firstName: "Wyatt",
    lastName: "Earp"
  });
  assert.equal(store.get('array')['person'][0].id, 'gambler', 'gambler in store');
  run(function() {
    store.destroy();
  });
  assert.equal(store.get('array'), null, 'store#array set to null');
  assert.equal(store.get('identityMap'), null, 'store#identityMap set to null');
  assert.equal(store.get('filtersMap'), null, 'store#filtersMap set to null');
  assert.equal(store.get('recompute'), null, 'store#recompute set to null');
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

test("models with int based ids must be lookedup by int and string value", function(assert) {
  store.push("person", {
    id: 123,
    firstName: "Toran",
    lastName: "Billups"
  });

  var toranbByNum = store.find("person", 123);
  assert.strictEqual(toranbByNum.get("id"), 123);
  assert.ok(toranbByNum.get("content") instanceof Person);

  toranbByNum = store.find("person", "123");
  assert.strictEqual(toranbByNum.get("id"), 123);
  assert.ok(toranbByNum.get("content") instanceof Person);
});

test("models with str based ids must be lookedup by str value", function(assert) {
  store.push("person", {
    id: "abc",
    firstName: "Toran",
    lastName: "Billups"
  });

  var toranbByStr = store.find("person", "abc");
  assert.strictEqual(toranbByStr.get("id"), "abc");
  assert.ok(toranbByStr.get("content") instanceof Person);
});

test("models with int !0 id in string must be lookedup by int and string value", function(assert) {
  store.push("person", {
    id: "1234",
    firstName: "Guillaume",
    lastName: "Gérard"
  });

  var guillaumeByNum = store.find("person", "1234");
  assert.strictEqual(guillaumeByNum.get("id"), 1234);
  assert.ok(guillaumeByNum.get("content") instanceof Person);

  guillaumeByNum = store.find("person", 1234);
  assert.strictEqual(guillaumeByNum.get("id"), 1234);
  assert.ok(guillaumeByNum.get("content") instanceof Person);
});

test("models with int 0 id must be lookedup by int and string value", function(assert) {
  store.push("person", {
    id: 0,
    firstName: "Guillaume",
    lastName: "Gérard"
  });

  var guillaumeByNum = store.find("person", "0");
  assert.strictEqual(guillaumeByNum.get("id"), 0);
  assert.ok(guillaumeByNum.get("content") instanceof Person);

  guillaumeByNum = store.find("person", 0);
  assert.strictEqual(guillaumeByNum.get("id"), 0);
  assert.ok(guillaumeByNum.get("content") instanceof Person);
});

test("models with int 0 id in string must be lookedup by int and string value", function(assert) {
  store.push("person", {
    id: "0",
    firstName: "Guillaume",
    lastName: "Gérard"
  });

  var guillaumeByNum = store.find("person", "0");
  assert.strictEqual(guillaumeByNum.get("id"), 0);
  assert.ok(guillaumeByNum.get("content") instanceof Person);

  guillaumeByNum = store.find("person", 0);
  assert.strictEqual(guillaumeByNum.get("id"), 0);
  assert.ok(guillaumeByNum.get("content") instanceof Person);
});

test("models with float id in string must be lookedup by int float and string value", function(assert) {
  store.push("person", {
    id: "3.14159265359",
    firstName: "Guillaume",
    lastName: "Gérard"
  });

  var guillaumeByNum = store.find("person", "3.14159265359");
  assert.strictEqual(guillaumeByNum.get("id"), 3.14159265359);
  assert.ok(guillaumeByNum.get("content") instanceof Person);

  guillaumeByNum = store.find("person", 3.14159265359);
  assert.strictEqual(guillaumeByNum.get("id"), 3.14159265359);
  assert.ok(guillaumeByNum.get("content") instanceof Person);
});

test("find should return array of bound models", function(assert) {
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

  var found_data = store.find("person");
  assert.equal(found_data.get("length"), 2);
  assert.equal(found_data.objectAt(0).get("firstName"), "Toran");
  assert.equal(found_data.objectAt(1).get("firstName"), "Brandon");

  store.push("person", {
    id: 3,
    firstName: "Scott",
    lastName: "Newcomer"
  });

  assert.equal(found_data.get("length"), 3);
  assert.equal(found_data.objectAt(0).get("firstName"), "Toran");
  assert.equal(found_data.objectAt(1).get("firstName"), "Brandon");
  assert.equal(found_data.objectAt(2).get("firstName"), "Scott");
});

test("remove should destroy the item by type", function(assert) {
  assert.expect(7);

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

  assert.equal(store.find("person").get("length"), 2);
  store.remove("person", first.get("id"));
  assert.equal(store.find("person").get("length"), 1);

  var first_person = store.find("person", first.id);
  assert.ok(!first_person.get("content"), "The toran record was still found");
  assert.equal(first_person.get("firstName"), undefined);

  var last_person = store.find("person", last.id);
  assert.ok(last_person.get("content"), "The brandon record was not found");
  assert.equal(last_person.get("firstName"), "Brandon");

  run.next(() => {
    try {
        first.set("firstName", "X");
    } catch (e) {
        assert.ok(e.message.indexOf("Assertion Failed: calling set on destroyed object") !== -1);
    }
  });
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

  assert.equal(store.find("person").get("length"), 3);
  assert.equal(store.find("person").objectAt(0).get("cat_id"), 1);
  assert.equal(store.find("person").objectAt(1).get("cat_id"), 2);
  assert.equal(store.find("person").objectAt(2).get("cat_id"), 1);

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

  assert.equal(store.find("person").get("length"), 5);
});

test("find with filter does not trump type property of object", function(assert) {
  store.push("person", {
    id: 9,
    firstName: "Jarrod",
    lastName: "Taylor",
    source: "Jarrod's Mom",
    store: "Walmart",
    type: "developer"
  });


  var found = store.find("person", 9);
    assert.equal(found.get("type"), "developer");
    assert.equal(found.get("store"), "Walmart");
    assert.equal(found.get("source"), "Jarrod's Mom");
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

  run(() => {
      store.push("person", {
          id: 14,
          firstName: "Another",
          lastName: "Person",
          cat_id: 1
      });
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
  assert.expect(16);

  var firstPerson = store.push("person", {
    id: 9,
    firstName: "Brandon",
    lastName: "Williams",
    cat_id: 1
  });

  var lastPerson = store.push("person", {
    id: 8,
    firstName: "Toran",
    lastName: "Billups",
    cat_id: 1
  });

  var firstCat = store.push("cat", {
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

  run(() => {
    store.clear("person");
  });

  assert.equal(firstBoundProperty.get("length"), 0);

  var all = store.find("person");
  assert.equal(all.get("length"), 0);

  var individualFirstAfter = store.find("person", 9);
  assert.equal(individualFirstAfter.get("content"), null);
  assert.equal(individualFirstAfter.get("firstName"), undefined);

  var individualLastAfter = store.find("person", 8);
  assert.equal(individualLastAfter.get("content"), null);
  assert.equal(individualLastAfter.get("firstName"), undefined);

  var catAfter = store.find("cat", 1);
  assert.equal(catAfter.get("color"), "red");

  var catsAfter = store.find("cat");
  assert.equal(catsAfter.get("length"), 1);

  run.next(() => {
    try {
        firstPerson.set("firstName", "X");
    } catch (e) {
        assert.ok(e.message.indexOf("Assertion Failed: calling set on destroyed object") !== -1);
    }

    try {
        lastPerson.set("firstName", "X");
    } catch (e) {
        assert.ok(e.message.indexOf("Assertion Failed: calling set on destroyed object") !== -1);
    }

    firstCat.set("color", "purple");
    assert.equal(firstCat.get("color"), "purple");
  });
});

test("clear without type will destroy everything", function(assert) {
  assert.expect(10);

  var firstPerson = store.push("person", {
    id: 9,
    firstName: "Brandon",
    lastName: "Williams",
    cat_id: 1
  });

  var lastPerson = store.push("person", {
    id: 8,
    firstName: "Toran",
    lastName: "Billups",
    cat_id: 1
  });

  var firstCat = store.push("cat", {
    id: 1,
    color: "red"
  });

  firstPerson.set("firstName", "R");
  lastPerson.set("firstName", "M");
  firstCat.set("color", "purple");

  assert.equal(firstPerson.get("firstName"), "R");
  assert.equal(lastPerson.get("firstName"), "M");
  assert.equal(firstCat.get("color"), "purple");

  assert.equal(store.find("person").get("length"), 2);
  assert.equal(store.find("cat").get("length"), 1);

  run(() => {
    store.clear();
  });

  assert.equal(store.find("person").get("length"), 0);
  assert.equal(store.find("cat").get("length"), 0);

  run.next(() => {
    try {
        firstPerson.set("firstName", "X");
    } catch (e) {
        assert.ok(e.message.indexOf("Assertion Failed: calling set on destroyed object") !== -1);
    }

    try {
        lastPerson.set("firstName", "X");
    } catch (e) {
        assert.ok(e.message.indexOf("Assertion Failed: calling set on destroyed object") !== -1);
    }

    try {
        firstCat.set("color", "rain");
    } catch (e) {
        assert.ok(e.message.indexOf("Assertion Failed: calling set on destroyed object") !== -1);
    }
  });
});

test("invoking clear multiple times will only schedule a recompute once per type", function(assert) {
  run(() => {
    store.clear("foo");
    store.clear("foo");
    store.clear("bar");
    store.clear("foo");
    assert.equal(store.get("recompute.length"), 2);
  });
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
  store.push("toran", {
    id: 1,
    firstName: "Jake",
    lastName: "Good"
  });

  store.push("toran", {
    id: 2,
    firstName: "Brandon",
    lastName: "Williams"
  });

  assert.equal(store.find("toran").get("length"), 2);

  var toranb = store.findOne("toran");
  assert.equal(toranb.get("firstName"), "Jake", "the firstName property is correct");
  assert.equal(toranb.get("lastName"), "Good", "the lastName property is correct");
  assert.equal(toranb.get("id"), "1", "the id property is correct");
  assert.equal(toranb.get("content").fake(), "Jake 999");
  assert.equal(toranb.get("content").demo(), "Jake 777");
  assert.equal(toranb.fake(), "Jake 999");
  assert.equal(toranb.demo(), "Jake 777");
});

test("findOne should return null when no objects exist in the cache for given type", function(assert) {
    assert.equal(store.find("person").get("length"), 0);
    var person = store.findOne("person");
    assert.equal(person.get("content"), null);
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

  var filtered_data = store.find("person", filter);

  assert.equal(filtered_data.get("length"), 2);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Toran");

  run(() => {
      store.push("person", {
        id: 6,
        firstName: "Taylor",
        lastName: "Hobbs",
        nickname: "zzz",
        group: 8
      });
  });

  assert.equal(filtered_data.get("length"), 3);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Toran");
  assert.equal(filtered_data.objectAt(2).get("firstName"), "Taylor");

  run(() => {
      store.push("person", {
        id: 5,
        firstName: "Matt",
        lastName: "Morrison",
        nickname: "bar",
        group: 0
      });
  });

  assert.equal(filtered_data.get("length"), 4);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Toran");
  assert.equal(filtered_data.objectAt(2).get("firstName"), "Taylor");
  assert.equal(filtered_data.objectAt(3).get("firstName"), "Matt");

  var taylor = store.find("person", 6);
  assert.equal(taylor.get("firstName"), "Taylor");
  // taylor.set("group", 1); in v3 this worked but v4 requires a push
  run(() => {
    store.push("person", {id: taylor.get("id"), group: 1});
  });

  assert.equal(filtered_data.get("length"), 3);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Toran");
  assert.equal(filtered_data.objectAt(2).get("firstName"), "Matt");

  var brandon = store.find("person", 8);
  assert.equal(brandon.get("firstName"), "Brandon");
  // brandon.set("group", 1); in v3 this worked but v4 requires a push
  run(() => {
    store.push("person", {id: brandon.get("id"), group: 1});
  });

  assert.equal(filtered_data.get("length"), 3);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Toran");
  assert.equal(filtered_data.objectAt(2).get("firstName"), "Matt");

  // brandon.set("nickname", "x"); in v3 this worked but v4 requires a push
  run(() => {
    store.push("person", {id: brandon.get("id"), nickname: "x"});
  });

  assert.equal(filtered_data.get("length"), 2);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Toran");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Matt");
});

test("findByIdComputed result will be computed property that updates as records are pushed into the store", function(assert) {
    var done = assert.async();
    var toranb = store.find("person", 123);
    assert.equal(toranb.get("id"), undefined);
    assert.equal(toranb.get("firstName"), undefined);
    assert.equal(toranb.get("lastName"), undefined);

    setTimeout(function() {
        run(() => {
            store.push("person", {
              id: 123,
              firstName: "Toran",
              lastName: "Billups"
            });
        });
        setTimeout(function() {
            assert.equal(toranb.get("id"), 123);
            assert.equal(toranb.get("firstName"), "Toran");
            assert.equal(toranb.get("lastName"), "Billups");
            done();
        }, 0);
    }, 0);
});

test("findByIdComputed also works with string based ids", function(assert) {
    var done = assert.async();
    var toranb = store.find("person", "abc123");
    assert.equal(toranb.get("id"), undefined);
    assert.equal(toranb.get("firstName"), undefined);
    assert.equal(toranb.get("lastName"), undefined);

    setTimeout(function() {
        run(() => {
            store.push("person", {
              id: "abc123",
              firstName: "Toran",
              lastName: "Billups"
            });
        });
        setTimeout(function() {
            assert.equal(toranb.get("id"), "abc123");
            assert.equal(toranb.get("firstName"), "Toran");
            assert.equal(toranb.get("lastName"), "Billups");
            done();
        }, 0);
    }, 0);
});

test("findByIdComputed truly works with guid based ids", function(assert) {
    var done = assert.async();
    var toranb = store.find("person", "55555555-ca0d-4126-8929-afdsaf789883");
    assert.equal(toranb.get("id"), undefined);
    assert.equal(toranb.get("firstName"), undefined);
    assert.equal(toranb.get("lastName"), undefined);

    setTimeout(function() {
        run(() => {
            store.push("person", {
              id: "55555555-ca0d-4126-8929-afdsaf789883",
              firstName: "Toran",
              lastName: "Billups"
            });
        });
        setTimeout(function() {
            assert.equal(toranb.get("id"), "55555555-ca0d-4126-8929-afdsaf789883");
            assert.equal(toranb.get("firstName"), "Toran");
            assert.equal(toranb.get("lastName"), "Billups");
            done();
        }, 0);
    }, 0);
});

test("findByIdComputed will return result with int based id using string", function(assert) {
    var done = assert.async();
    var toranb = store.find("person", "4");
    assert.equal(toranb.get("id"), undefined);
    assert.equal(toranb.get("firstName"), undefined);
    assert.equal(toranb.get("lastName"), undefined);

    setTimeout(function() {
        run(() => {
            store.push("person", {
              id: 4,
              firstName: "Toran",
              lastName: "Billups"
            });
        });
        setTimeout(function() {
            assert.equal(toranb.get("id"), 4);
            assert.equal(toranb.get("firstName"), "Toran");
            assert.equal(toranb.get("lastName"), "Billups");
            done();
        }, 0);
    }, 0);
});

test("findById will proxy each method for the given type when updated", function(assert) {
    var done = assert.async();
    var toranb = store.find("toran", 6);
    assert.equal(toranb.get("id"), undefined);

    setTimeout(function() {
        run(() => {
            store.push("toran", {
              id: 6,
              firstName: "Toran",
              lastName: "Billups"
            });
        });
        setTimeout(function() {
            assert.equal(toranb.get("id"), 6);
            assert.equal(toranb.get("firstName"), "Toran");
            assert.equal(toranb.get("content").fake(), "Toran 999");
            assert.equal(toranb.get("content").demo(), "Toran 777");
            assert.equal(toranb.fake(), "Toran 999");
            assert.equal(toranb.demo(), "Toran 777");

            done();
        }, 0);
    }, 0);
});

test("findById will proxy each method for the given type when already in the store", function(assert) {
  store.push("toran", {
    id: 5,
    firstName: "Toran",
    lastName: "Billups"
  });
  store.push("toran", {
    id: 3,
    firstName: "Other",
    lastName: "Person"
  });

  var toranb = store.find("toran", 5);
  assert.ok(toranb, "The toranb record was found");

  assert.equal(toranb.get("firstName"), "Toran");
  assert.equal(toranb.get("content").fake(), "Toran 999");
  assert.equal(toranb.get("content").demo(), "Toran 777");
  assert.equal(toranb.fake(), "Toran 999");
  assert.equal(toranb.demo(), "Toran 777");

  var other = store.find("toran", 3);
  assert.ok(other, "The other record was found");

  assert.equal(other.get("firstName"), "Other");
  assert.equal(other.get("content").fake(), "Other 999");
  assert.equal(other.get("content").demo(), "Other 777");
  assert.equal(other.fake(), "Other 999");
  assert.equal(other.demo(), "Other 777");

  toranb = store.find("toran", 5);
  assert.ok(toranb, "The toranb record was found");

  assert.equal(toranb.get("firstName"), "Toran");
  assert.equal(toranb.get("content").fake(), "Toran 999");
  assert.equal(toranb.get("content").demo(), "Toran 777");
  assert.equal(toranb.fake(), "Toran 999");
  assert.equal(toranb.demo(), "Toran 777");
});

test("findOne result will be computed property that updates as records are pushed into the store", function(assert) {
  var done = assert.async();
  var toran = store.findOne("toran");
  assert.equal(toran.get("id"), undefined);
  assert.equal(toran.get("firstName"), undefined);
  assert.equal(toran.get("lastName"), undefined);
  setTimeout(function() {
    run(() => {
        store.push("toran", {
          id: 123,
          firstName: "Toran",
          lastName: "Billups"
        });
    });

    setTimeout(function() {
      assert.equal(toran.get("id"), 123);
      assert.equal(toran.get("firstName"), "Toran");
      assert.equal(toran.get("lastName"), "Billups");
      assert.equal(toran.get("content").fake(), "Toran 999");
      assert.equal(toran.get("content").demo(), "Toran 777");
      assert.equal(toran.fake(), "Toran 999");
      assert.equal(toran.demo(), "Toran 777");

      done();
    }, 0);
  }, 0);
});

test("store will not update object with id of undefined", function(assert) {
    store.push("person", {});
    assert.equal(store.find("person").get("length"), 1);
    store.push("person", {id: 1, name: "foo"});
    assert.equal(store.find("person").get("length"), 2);
    var people = store.find("person");
    assert.equal(people.objectAt(0).id, undefined);
    assert.equal(people.objectAt(1).id, 1);
});

test("store will update object with id of undefined when setting properties", function(assert) {
    var person = store.push("person", {});
    assert.equal(store.find("person").get("length"), 1);
    person.setProperties({id: 1, name: "foo"});
    assert.equal(store.find("person").get("length"), 1);
    var people = store.find("person");
    assert.equal(people.objectAt(0).id, 1);
});

test("find with filter returns array proxy with push function that adds record", function(assert) {
  store.push("person", {
    id: 9,
    firstName: "Jarrod",
    lastName: "Taylor",
    nickname: "foo",
    group: 2
  });

  store.push("person", {
    id: 8,
    firstName: "Toran",
    lastName: "Billups",
    nickname: "wat",
    group: 3
  });

  var filtered_data = store.find("person", {group: 2});

  assert.equal(filtered_data.get("length"), 1);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Jarrod");

  var created;
  run(() => {
      created = filtered_data.push({
        id: 6,
        firstName: "Taylor",
        lastName: "Hobbs",
        nickname: "zzz",
        group: 2
      });
  });

  assert.equal(created.get("id"), 6);
  assert.equal(created.get("firstName"), "Taylor");

  assert.equal(filtered_data.get("length"), 2);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Jarrod");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Taylor");

  assert.equal(store.find("person", 6).get("firstName"), "Taylor");
  assert.equal(store.find("person", 9).get("firstName"), "Jarrod");
});

test("find with filter function returns array proxy with push function that adds record", function(assert) {
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

  var filtered_data = store.find("person", filter);

  assert.equal(filtered_data.get("length"), 2);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Toran");

  run(() => {
      store.push("person", {
        id: 6,
        firstName: "Taylor",
        lastName: "Hobbs",
        nickname: "zzz",
        group: 8
      });
  });

  assert.equal(filtered_data.get("length"), 3);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Toran");
  assert.equal(filtered_data.objectAt(2).get("firstName"), "Taylor");

  var created;
  run(() => {
      created = filtered_data.push({
        id: 5,
        firstName: "Scott",
        lastName: "Newcomer",
        nickname: "bar",
        group: 1
      });
  });

  assert.equal(filtered_data.get("length"), 4);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Toran");
  assert.equal(filtered_data.objectAt(2).get("firstName"), "Taylor");
  assert.equal(filtered_data.objectAt(3).get("firstName"), "Scott");

  assert.equal(created.get("id"), 5);
  assert.equal(created.get("firstName"), "Scott");

  assert.equal(store.find("person", 8).get("firstName"), "Brandon");
  assert.equal(store.find("person", 7).get("firstName"), "Toran");
  assert.equal(store.find("person", 6).get("firstName"), "Taylor");
  assert.equal(store.find("person", 5).get("firstName"), "Scott");
});

test("find returns array proxy with push function that adds record", function(assert) {
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

  var found_data = store.find("person");
  assert.equal(found_data.get("length"), 2);
  assert.equal(found_data.objectAt(0).get("firstName"), "Toran");
  assert.equal(found_data.objectAt(1).get("firstName"), "Brandon");

  var created;
  run(() => {
      created = found_data.push({
        id: 3,
        firstName: "Scott",
        lastName: "Newcomer"
      });
  });

  assert.equal(found_data.get("length"), 3);
  assert.equal(found_data.objectAt(0).get("firstName"), "Toran");
  assert.equal(found_data.objectAt(1).get("firstName"), "Brandon");
  assert.equal(found_data.objectAt(2).get("firstName"), "Scott");

  assert.equal(created.get("id"), 3);
  assert.equal(created.get("firstName"), "Scott");

  assert.equal(store.find("person", 1).get("firstName"), "Toran");
  assert.equal(store.find("person", 2).get("firstName"), "Brandon");
  assert.equal(store.find("person", 3).get("firstName"), "Scott");
});

test("bound array proxy from find will correctly respect the push of different types", function(assert) {
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

  store.push("cat", {
    id: 1,
    color: "red"
  });

  store.push("cat", {
    id: 2,
    color: "green"
  });

  var found_data = store.find("person");
  assert.equal(found_data.get("length"), 2);
  assert.equal(found_data.objectAt(0).get("firstName"), "Toran");
  assert.equal(found_data.objectAt(1).get("firstName"), "Brandon");

  run(() => {
      found_data.push({
        id: 3,
        firstName: "Scott",
        lastName: "Newcomer"
      });
  });

  assert.equal(found_data.get("length"), 3);
  assert.equal(found_data.objectAt(0).get("firstName"), "Toran");
  assert.equal(found_data.objectAt(1).get("firstName"), "Brandon");
  assert.equal(found_data.objectAt(2).get("firstName"), "Scott");

  assert.equal(store.find("person", 1).get("firstName"), "Toran");
  assert.equal(store.find("person", 2).get("firstName"), "Brandon");
  assert.equal(store.find("person", 3).get("firstName"), "Scott");

  var found_cats = store.find("cat");
  assert.equal(found_cats.get("length"), 2);
  assert.equal(found_cats.objectAt(0).get("color"), "red");
  assert.equal(found_cats.objectAt(1).get("color"), "green");

  run(() => {
      found_cats.push({
        id: 3,
        color: "yellow"
      });
  });

  assert.equal(found_cats.get("length"), 3);
  assert.equal(found_cats.objectAt(0).get("color"), "red");
  assert.equal(found_cats.objectAt(1).get("color"), "green");
  assert.equal(found_cats.objectAt(2).get("color"), "yellow");

  assert.equal(store.find("cat", 1).get("color"), "red");
  assert.equal(store.find("cat", 2).get("color"), "green");
  assert.equal(store.find("cat", 3).get("color"), "yellow");

  run(() => {
      found_data.push({
        id: 4,
        firstName: "Matt",
        lastName: "Morrison"
      });
  });

  assert.equal(found_cats.get("length"), 3);
  assert.equal(found_data.get("length"), 4);
});

test("find returns array proxy that has a remove function that removes the record", function(assert) {
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

  var found_data = store.find("person");
  assert.equal(found_data.get("length"), 2);
  assert.equal(found_data.objectAt(0).get("firstName"), "Toran");
  assert.equal(found_data.objectAt(1).get("firstName"), "Brandon");

  run(() => {
    found_data.remove(1);
  });

  assert.equal(found_data.get("length"), 1);
  assert.equal(found_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(store.find("person", 2).get("firstName"), "Brandon");

  run(() => {
      found_data.push({
          id: 1,
          lastName: "new"
      });
  });

  assert.equal(store._findById("person", 1).get("firstName"), "");
  assert.equal(store._findById("person", 1).get("lastName"), "new");
});

test("find with filter returns array proxy that has a remove function that removes the record", function(assert) {
  store.push("person", {
    id: 9,
    firstName: "Jarrod",
    lastName: "Taylor",
    nickname: "foo",
    group: 2
  });

  store.push("person", {
    id: 8,
    firstName: "Toran",
    lastName: "Billups",
    nickname: "wat",
    group: 3
  });

  store.push("person", {
    id: 7,
    firstName: "Scott",
    lastName: "Newcomer",
    nickname: "barz",
    group: 2
  });

  var filtered_data = store.find("person", {group: 2});

  assert.equal(filtered_data.get("length"), 2);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Jarrod");

  run(() => {
    filtered_data.remove(9);
  });

  assert.equal(filtered_data.get("length"), 1);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Scott");
  assert.equal(store.find("person", 7).get("firstName"), "Scott");
  assert.equal(store.find("person", 8).get("firstName"), "Toran");

  run(() => {
      filtered_data.push({
          id: 9,
          lastName: "new"
      });
  });

  assert.equal(store._findById("person", 9).get("firstName"), "");
  assert.equal(store._findById("person", 9).get("lastName"), "new");
});

test("find with filter function returns array proxy that has a remove function that removes the record", function(assert) {
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

  var filtered_data = store.find("person", filter);

  assert.equal(filtered_data.get("length"), 2);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Brandon");
  assert.equal(filtered_data.objectAt(1).get("firstName"), "Toran");

  run(() => {
    filtered_data.remove(8);
  });

  assert.equal(filtered_data.get("length"), 1);
  assert.equal(filtered_data.objectAt(0).get("firstName"), "Toran");

  run(() => {
      filtered_data.push({
          id: 8,
          lastName: "new"
      });
  });

  assert.equal(store._findById("person", 8).get("firstName"), "");
  assert.equal(store._findById("person", 8).get("lastName"), "new");
});

var Listing;

moduleFor("service:simple-store", "store unit tests -- custom primary key", {
  beforeEach: function() {
    Listing = Ember.Object.extend({
        listing_id: null,
        description: null
    });

    Listing.reopenClass({
        primaryKey: "listing_id"
    });
    const owner = getOwner(this);
    store = this.subject();
    owner.register("model:listing", Listing);
  }
});

test("store#push and store#find use the specified primary key", function(assert) {
  store.push("listing", {
    listing_id: 5,
    description: "A lovely vase"
  });

  var listing = store.find("listing", 5);
  assert.ok(listing, "The listing record was found");

  assert.equal(listing.get("description"), "A lovely vase", "the description property is correct");
});

test("remove should destory the item by type", function(assert) {
  var first = store.push("listing", {
    listing_id: 1,
    description: "Ugly vase"
  });

  var last = store.push("listing", {
    listing_id: 2,
    description: "A 'Sorcier des Glaces' CD"
  });

  assert.equal(store.find("listing").get("length"), 2);
  store.remove("listing", first.listing_id);
  assert.equal(store.find("listing").get("length"), 1);

  var first_listing = store.find("listing", first.listing_id);
  assert.ok(!first_listing.get("content"), "The ugly vase record was not found");
  assert.equal(first_listing.get("description"), undefined);

  var last_listing = store.find("listing", last.listing_id);
  assert.ok(last_listing.get("content"), "The 'Sorcier des Glaces' record was still found");
  assert.equal(last_listing.get("description"), "A 'Sorcier des Glaces' CD");
});
