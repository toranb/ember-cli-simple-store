import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { get } from '@ember/object';

let RobotsRoute = Route.extend({
    simpleStore: service(),
    model: function() {
        let simpleStore = this.get("simpleStore");
        simpleStore.push("robot", {id: 9, name: "nine", size: 229});
        simpleStore.push("robot", {id: 8, name: "eight", size: 9});
        simpleStore.push("robot", {id: 7, name: "seven", size: 11});
        //this filter existed previously but was removed (now it will be recreated)
        let one = function(m) {
            return get(m, "size") > 50;
        };
        //this filter is new and different
        let eight = function(m) {
            return get(m, "size") > 10 && get(m, "name") === "seven";
        };
        let filternine = simpleStore.find("robot", one);
        let filtereight = simpleStore.find("robot", eight);
        return {filternine, filtereight};
    },
    setupController: function(controller, hash) {
        controller.set("filternine", hash.filternine);
        controller.set("filtereight", hash.filtereight);
    }
});

export default RobotsRoute;
