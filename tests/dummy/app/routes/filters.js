import Ember from "ember";

const { get } = Ember;

var FiltersRoute = Ember.Route.extend({
    simpleStore: Ember.inject.service(),
    model() {
        var simpleStore = this.get("simpleStore");
        if(simpleStore.find("robot").get("length") === 0) {
            //hack to prevent another push of the same data
            simpleStore.push("robot", {id: 1, name: "r one", size: 51});
            simpleStore.push("robot", {id: 2, name: "r two", size: 52});
            simpleStore.push("robot", {id: 3, name: "r three", size: 53});
            simpleStore.push("zing", {id: 1, name: "z one", number: 49});
            simpleStore.push("zing", {id: 2, name: "z two", number: 48});
            simpleStore.push("zing", {id: 3, name: "z three", number: 47});
        }
        var one = function(m) {
            return get(m, "size") > 50;
        };
        var two = function(m) {
            return get(m, "size") > 10;
        };
        var three = function(m) {
            return get(m, "number") < 50;
        };
        var four = function(m) {
            return get(m, "number") < 90;
        };
        var filterone = simpleStore.find("robot", one);
        var filtertwo = simpleStore.find("robot", two);
        var filterthree = simpleStore.find("zing", three);
        var filterfour = simpleStore.find("zing", four);
        return {filterone, filtertwo, filterthree, filterfour};
    },
    setupController(controller, hash) {
        controller.set("filterone", hash.filterone);
        controller.set("filtertwo", hash.filtertwo);
        controller.set("filterthree", hash.filterthree);
        controller.set("filterfour", hash.filterfour);
    },
    actions: {
        willTransition() {
            var currentModel = this.get("currentModel");
            currentModel.filterone.destroy();
            currentModel.filtertwo.destroy();
            currentModel.filterthree.destroy();
            currentModel.filterfour.destroy();
        }
    }
});

export default FiltersRoute;
