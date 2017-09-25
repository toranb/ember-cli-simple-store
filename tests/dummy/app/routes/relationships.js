import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

let RelationshipsRoute = Route.extend({
    simpleStore: service(),
    model() {
        let user_id = 2;
        let simpleStore = this.get("simpleStore");
        simpleStore.push("role", {id: 8, name: "Admin", users: []});
        simpleStore.push("role", {id: 9, name: "Guest", users: [user_id]});
        simpleStore.push("user", {id: user_id, name: "toran"});
        let model = simpleStore.find("user", user_id);
        let roles = simpleStore.find("role");
        return {model: model, roles: roles};
    },
    setupController(controller, hash) {
        controller.set("model", hash.model);
        controller.set("roles", hash.roles);
    }
});

export default RelationshipsRoute;
