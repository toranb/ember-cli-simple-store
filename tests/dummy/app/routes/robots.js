import Ember from "ember";

var RobotsRoute = Ember.Route.extend({
    model: function() {
        var store = this.get("store");
        store.push("robot", {id: 9, name: "nine", size: 229});
        store.push("robot", {id: 8, name: "eight", size: 9});
        store.push("robot", {id: 7, name: "seven", size: 11});
        //this filter existed previously but was removed (now it will be recreated)
        var one = function(m) {
            return m.get("size") > 50;
        };
        //this filter is new and different
        var eight = function(m) {
            return m.get("size") > 10 && m.get("name") === "seven";
        };
        var filternine = store.find("robot", one);
        var filtereight = store.find("robot", eight);
        return {filternine, filtereight};
    },
    setupController: function(controller, hash) {
        controller.set("filternine", hash.filternine);
        controller.set("filtereight", hash.filtereight);
    }
});

export default RobotsRoute;
