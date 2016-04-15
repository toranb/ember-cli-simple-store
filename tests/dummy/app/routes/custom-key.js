import Ember from "ember";

export default Ember.Route.extend({
    simpleStore: Ember.inject.service(),
    model() {
        var simpleStore = this.get("simpleStore");
        if(simpleStore.find("custom-key").get("length") === 0) {
            //hack to prevent another push of the same data
            simpleStore.push("custom-key", {arbitraryKey: 1, name: "k one"});
            simpleStore.push("custom-key", {arbitraryKey: 2, name: "k two"});
            simpleStore.push("custom-key", {arbitraryKey: 3, name: "k three"});
        }

        return simpleStore.find('custom-key', (record =>
            record.get('name').indexOf('three') >= 0));
    },
    actions: {
        willTransition () {
            this.get('controller.model').destroy();
        }
    }
});
