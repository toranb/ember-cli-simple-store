import Route from '@ember/routing/route';
import Foo from 'dummy/models/foo';

let WatRoute = Route.extend({
    model: function() {
        return Foo.create();
    }
});

export default WatRoute;
