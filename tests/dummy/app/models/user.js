import $ from 'jquery';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { attr, Model } from "ember-cli-simple-store/model";

export default Model.extend({
    name: attr(),
    simpleStore: service(),
    role: alias("belongs_to.firstObject"),
    belongs_to: computed(function() {
        let user_id = this.get("id");
        let store = this.get("simpleStore");
        let filter = function(role) {
            let users = role.get("users");
            return $.inArray(user_id, users) > -1;
        };
        return store.find("role", filter);
    }),
    change_role(new_role_id) {
        let user_name = this.get("name");
        let user_id = this.get("id");
        let store = this.get("simpleStore");
        let old_role = this.get("role");
        let old_role_users = old_role.get("users") || [];
        let updated_old_role_users = old_role_users.filter((id) => {
            return id !== user_id;
        });
        let new_role = store.find("role", new_role_id);
        let new_role_users = new_role.get("users") || [];
        store.push("user", {id: user_id, name: user_name}); //only to test perf
        // old_role.set("users", updated_old_role_users); in v3 this worked but v4 requires a push
        store.push("role", {id: old_role.get("id"), users: updated_old_role_users});
        // new_role.set("users", new_role_users.concat(user_id)); in v3 this worked but v4 requires a push
        store.push("role", {id: new_role.get("id"), users: new_role_users.concat(user_id)});
        store.push("user", {id: user_id, nope: "wat"}); //only to test perf
    }
});
