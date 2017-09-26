import Route from '@ember/routing/route';
import Foo from 'dummy/models/foo';

export default Route.extend({
    model: function() {
        return Foo.create();
    }
});
