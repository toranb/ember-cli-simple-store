import Ember from 'ember';
import Foo from 'dummy/models/foo';

export default Ember.Route.extend({
    model: function() {
        return Foo.create({name: "wat", funny: true});
    }
});
