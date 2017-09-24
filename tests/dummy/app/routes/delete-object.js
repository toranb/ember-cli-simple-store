import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
    simpleStore: service(),
    model() {
        var simpleStore = this.get("simpleStore");
        return simpleStore.push("wat", {id: 1, number: 0});
    }
});
