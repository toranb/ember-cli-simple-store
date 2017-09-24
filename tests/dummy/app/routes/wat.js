import Route from '@ember/routing/route';
import Foo from 'dummy/models/foo';

var WatRoute = Route.extend({
    model: function() {
        return Foo.create();
    }
});

export default WatRoute;
