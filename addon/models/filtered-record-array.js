import { A } from '@ember/array';
import { computed } from '@ember/object';
import RecordArray from './record-array';

export default RecordArray.extend({
    content: computed(function () {
        return this.updateContent();
    }),

    updateContent() {
        var source = this.get("_source");
        var filter_func = this.get("_filter_func");

        return A(source.filter(filter_func));
    },

    willDestroy() {
        this._unregisterRecordArray();
        this._super(...arguments);
    },

    _unregisterRecordArray() {
        var store = this.get("_store");
        store._unsubscribe(this);
    }
});
