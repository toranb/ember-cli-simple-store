import Ember from "ember";
import {test, module} from "dummy/tests/helpers/qunit";
import registration from "dummy/tests/helpers/registration";

var store, user, role, run = Ember.run;

module("unit: user model test", {
    beforeEach() {
        store = registration(this.container, this.registry, ["model:user", "model:role"]);
    }
});

test("role property returns associated model or undefined", function(assert) {
    run(function() {
        user = store.push("user", {id: 1, name: "toran"});
        store.push("role", {id: 9, name: "Guest", users: [1]});
    });
    role = user.get("role");
    assert.equal(role.get("id"), 9);
    assert.equal(role.get("name"), "Guest");
    // role.set("users", []); in v3 this worked but v4 requires a push
    run(function() {
        store.push("role", {id: 9, users: []});
    });
    role = user.get("role");
    assert.equal(role, undefined);
});

test("change_role will append user id to the (new) role users array", function(assert) {
    run(function() {
        user = store.push("user", {id: 1, name: "toran"});
        store.push("role", {id: 8, name: "Admin", users: [9, 8]});
        store.push("role", {id: 9, name: "Guest", users: [1]});
    });
    role = user.get("role");
    assert.equal(role.get("id"), 9);
    user.change_role(8);
    role = user.get("role");
    assert.equal(role.get("id"), 8);
    assert.deepEqual(role.get("users"), [9, 8, 1]);
});

test("change_role will remove user id from the (old) role users array", function(assert) {
    var guest;
    run(function() {
        user = store.push("user", {id: 1, name: "toran"});
        guest = store.push("role", {id: 9, name: "Guest", users: [9, 1, 8]});
        store.push("role", {id: 8, name: "Admin", users: []});
    });
    role = user.get("role");
    assert.equal(role.get("id"), 9);
    user.change_role(8);
    role = user.get("role");
    assert.equal(role.get("id"), 8);
    assert.deepEqual(guest.get("users"), [9, 8]);
});
