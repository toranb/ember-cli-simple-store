import { A } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';
import { computed } from '@ember/object';

export default ArrayProxy.extend({
    _store: null,
    _type: null,

    content: computed(function () {
        return A(this.get("_source"));
    }),

    push(data) {
        let type = this.get('_type');
        return this.get('_store').push(type, data);
    },

    remove(id) {
        let type = this.get('_type');
        this.get('_store').remove(type, id);
    }
});
