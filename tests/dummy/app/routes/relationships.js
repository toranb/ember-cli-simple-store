import Ember from "ember";

var RelationshipsRoute = Ember.Route.extend({
    model: function() {
        var user_id = 2;
        var store = this.get("store");
        Ember.run(function() {
            store.push("role", {id: 8, name: "Admin", users: []});
            store.push("role", {id: 9, name: "Guest", users: [user_id]});
            store.push("user", {id: user_id, name: "toran"});
        });
        var model = store.find("user", user_id);
        var roles = store.find("role");
        return {model: model, roles: roles};
    },
    setupController: function(controller, hash) {
        controller.set("model", hash.model);
        controller.set("roles", hash.roles);
    }
});

export default RelationshipsRoute;
