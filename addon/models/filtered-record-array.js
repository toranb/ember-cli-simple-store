import Ember from 'ember';
import RecordArray from './record-array';

const { computed } = Ember;

export default RecordArray.extend({
    content: computed(function () {
        return this.updateContent();
    }),

    updateContent() {
        var source = this.get("source");
        var filter_func = this.get("filter_func");

        return Ember.A(source.filter(filter_func));
    },

    willDestroy() {
        this._unregisterRecordArray();
        this._super(...arguments);
    },

    _unregisterRecordArray() {
        var store = this.get("store");
        store._unsubscribe(this);
    }
});
