import Ember from 'ember';
import Foo from 'dummy/models/foo';

var WatRoute = Ember.Route.extend({
    model: function() {
        return Foo.create();
    }
});

export default WatRoute;
