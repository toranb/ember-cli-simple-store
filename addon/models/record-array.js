import Ember from 'ember';

const { ArrayProxy, computed } = Ember;

export default ArrayProxy.extend({
    _store: null,
    _type: null,

    content: computed(function () {
        return Ember.A(this.get("_source"));
    }),

    push(data) {
        var type = this.get('_type');
        return this.get('_store').push(type, data);
    },

    remove(id) {
        var type = this.get('_type');
        this.get('_store').remove(type, id);
    }
});
