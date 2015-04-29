import Ember from 'ember';
import Wow from 'dummy/models/wow';

export default Ember.Route.extend({
    model: function() {
        return Wow.create();
    }
});
