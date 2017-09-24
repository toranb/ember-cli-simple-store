import { A } from '@ember/array';
import Route from '@ember/routing/route';
import Foo from 'dummy/models/foo';

let IsNoneRoute = Route.extend({
    model: function() {
        let one = Foo.create({id: 1, name: undefined});
        let two = Foo.create({id: 2, name: null});
        return A([one, two]);
    }
});

export default IsNoneRoute;
