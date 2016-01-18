import Ember from "ember";

var FiltersRoute = Ember.Route.extend({
    model: function() {
        var store = this.get("store");
        if(store.find("robot").get("length") === 0) {
            //hack to prevent another push of the same data
            store.push("robot", {id: 1, name: "r one", size: 51});
            store.push("robot", {id: 2, name: "r two", size: 52});
            store.push("robot", {id: 3, name: "r three", size: 53});
            store.push("zing", {id: 1, name: "z one", number: 49});
            store.push("zing", {id: 2, name: "z two", number: 48});
            store.push("zing", {id: 3, name: "z three", number: 47});
        }
        var one = function(m) {
            return m.get("size") > 50;
        };
        var two = function(m) {
            return m.get("size") > 10;
        };
        var three = function(m) {
            return m.get("number") < 50;
        };
        var four = function(m) {
            return m.get("number") < 90;
        };
        var filterone = store.find("robot", one);
        var filtertwo = store.find("robot", two);
        var filterthree = store.find("zing", three);
        var filterfour = store.find("zing", four);
        return {filterone, filtertwo, filterthree, filterfour};
    },
    setupController: function(controller, hash) {
        controller.set("filterone", hash.filterone);
        controller.set("filtertwo", hash.filtertwo);
        controller.set("filterthree", hash.filterthree);
        controller.set("filterfour", hash.filterfour);
    },
    actions: {
        willTransition: function() {
            var store = this.get("store");
            var currentModel = this.get("currentModel");
            store.unsubscribe(currentModel.filterone, currentModel.filtertwo, currentModel.filterthree, currentModel.filterfour);
        }
    }
});

export default FiltersRoute;
