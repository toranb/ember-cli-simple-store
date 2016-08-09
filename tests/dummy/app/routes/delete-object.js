import Ember from "ember";

export default Ember.Route.extend({
    simpleStore: Ember.inject.service(),
    model() {
        var simpleStore = this.get("simpleStore");
        return simpleStore.push("wat", {id: 1, number: 0});
    }
});
