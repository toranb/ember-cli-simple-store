import Ember from "ember";

var RobotsRoute = Ember.Route.extend({
    model: function() {
        var store = this.get("store");
        store.push("robot", {id: 9, name: "nine", size: 229});
        store.push("robot", {id: 8, name: "eight", size: 9});
        store.push("robot", {id: 7, name: "seven", size: 11});
        //this filter already exists and thus should be reused
        //note: the functions name "one" is used for equality
        var one = function(m) {
            return m.get("size") > 50;
        };
        //this filter is slightly different and should remain
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
