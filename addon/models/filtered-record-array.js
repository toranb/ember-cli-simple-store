import { A } from '@ember/array';
import { computed } from '@ember/object';
import RecordArray from './record-array';

export default RecordArray.extend({
    content: computed(function () {
        return this.updateContent();
    }),

    updateContent() {
        let source = this.get("_source");
        let filter_func = this.get("_filter_func");

        return A(source.filter(filter_func));
    },

    willDestroy() {
        this._unregisterRecordArray();
        this._super(...arguments);
    },

    _unregisterRecordArray() {
        let store = this.get("_store");
        store._unsubscribe(this);
    }
});
