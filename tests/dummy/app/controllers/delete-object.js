import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
    simpleStore: service(),
    actions: {
        stop: function() {
            var simpleStore = this.get("simpleStore");
            simpleStore.remove("wat", 1);
        }
    }
});
