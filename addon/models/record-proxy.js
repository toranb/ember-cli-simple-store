import ObjectProxy from '@ember/object/proxy';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';

export default ObjectProxy.extend({
    _source: null,
    _store: null,
    _type: null,

    content: computed("_source.[]", function() {
        return this.compute();
    }),

    init() {
        this._super(...arguments);
        const store = this.get('_store');
        const type = this.get('_type');

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
