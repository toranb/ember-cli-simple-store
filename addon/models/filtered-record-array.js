import Ember from 'ember';
import RecordArray from './record-array';

const { computed } = Ember;

export default RecordArray.extend({
    content: computed(function () {
        var source = this.get("source");
        var filter_func = this.get("filter_func");
        return Ember.A(source.filter(filter_func));
    }),

    updateContent() {
        var source = this.get("source");
        var filter_func = this.get("filter_func");
        return source.filter(filter_func);
    }
});
