import Ember from 'ember';
import Foo from 'dummy/models/foo';

var IsNoneRoute = Ember.Route.extend({
    model: function() {
        var one = Foo.create({id: 1, name: undefined});
        var two = Foo.create({id: 2, name: null});
        return Ember.A([one, two]);
    }
});

export default IsNoneRoute;
