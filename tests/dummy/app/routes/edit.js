import Ember from 'ember';
import Foo from 'dummy/models/foo';

var EditRoute = Ember.Route.extend({
    model: function() {
        return Foo.create({id: 1, name: "toran"});
    }
});

export default EditRoute;
