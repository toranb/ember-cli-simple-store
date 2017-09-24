import Route from '@ember/routing/route';
import Foo from 'dummy/models/foo';

var EditRoute = Route.extend({
    model: function() {
        return Foo.create({id: 1, name: "toran"});
    }
});

export default EditRoute;
