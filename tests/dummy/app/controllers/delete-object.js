import Ember from "ember";

export default Ember.Controller.extend({
    simpleStore: Ember.inject.service(),
    actions: {
        stop: function() {
            var simpleStore = this.get("simpleStore");
            simpleStore.remove("wat", 1);
        }
    }
});
