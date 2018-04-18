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

        let model = getOwner(store).lookup(`model:${type}`);

        this.isCopyingMethods = true;
        for(let method in model) {
            if(typeof model[method] === "function") {
                if(!this[method]) {
                    this.proxyMethod(method);
                }
            }
        }
        this.isCopyingMethods = false;
    },

    compute() { },

    unknownProperty() {
        if (this.isCopyingMethods) {
            return;
        }
        return this._super(...arguments);
    },

    proxyMethod(method) {
        this[method] = function() {
            let content = this.get("content");
            return content[method].apply(content, arguments);
        };
    }
});
