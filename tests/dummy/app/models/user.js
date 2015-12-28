import Ember from "ember";
import inject from "dummy/utilities/inject";
import { attr, Model } from "ember-cli-simple-store/model";

export default Model.extend({
    name: attr(),
    store: inject("main"),
    role: Ember.computed.alias("belongs_to.firstObject"),
    belongs_to: Ember.computed(function() {
        var user_id = this.get("id");
        var store = this.get("store");
        var filter = function(role) {
            var users = role.get("users");
            return Ember.$.inArray(user_id, users) > -1;
        };
        return store.find("role", filter);
    }),
    change_role: function(new_role_id) {
        var user_name = this.get("name");
        var user_id = this.get("id");
        var store = this.get("store");
        var old_role = this.get("role");
        var old_role_users = old_role.get("users") || [];
        var updated_old_role_users = old_role_users.filter(function(id) {
            return id !== user_id;
        });
        var new_role = store.find("role", new_role_id);
        var new_role_users = new_role.get("users") || [];
        Ember.run(function() {
            store.push("user", {id: user_id, name: user_name}); //only to test perf
            // old_role.set("users", updated_old_role_users); in v3 this worked but v4 requires a push
            store.push("role", {id: old_role.get("id"), users: updated_old_role_users});
            // new_role.set("users", new_role_users.concat(user_id)); in v3 this worked but v4 requires a push
            store.push("role", {id: new_role.get("id"), users: new_role_users.concat(user_id)});
            store.push("user", {id: user_id, nope: "wat"}); //only to test perf
        });
    }
});
