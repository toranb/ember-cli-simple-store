import Ember from 'ember';

const { ArrayProxy, computed } = Ember;

export default ArrayProxy.extend({
    store: null,
    type: null,

    content: computed(function () {
        return Ember.A(this.get("source"));
    }),

    push(data) {
        var type = this.get('type');
        return this.get('store').push(type, data);
    },

    remove(id) {
        var type = this.get('type');
        this.get('store').remove(type, id);
    }
});
