import { A } from '@ember/array';
import Route from '@ember/routing/route';
import Foo from 'dummy/models/foo';

var IsNoneRoute = Route.extend({
    model: function() {
        var one = Foo.create({id: 1, name: undefined});
        var two = Foo.create({id: 2, name: null});
        return A([one, two]);
    }
});

export default IsNoneRoute;
