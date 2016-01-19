import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';

const { computed } = Ember;

export default Ember.ObjectProxy.extend({
    source: null,
    store: null,
    type: null,

    content: computed("source.[]", function() {
        return this.compute();
    }),

    init() {
        this._super(...arguments);
        const store = this.get('store');
        const type = this.get('type');

        var model = getOwner(store).lookup(`model:${type}`);

        for(var method in model) {
            if(typeof model[method] === "function") {
                if(!this[method]) {
                    this.proxyMethod(method);
                }
            }
        }
    },

    compute() { },

    proxyMethod(method) {
        this[method] = function() {
            var content = this.get("content");
            return content[method].apply(content, arguments);
        };
    }
});
