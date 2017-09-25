import Route from '@ember/routing/route';
import Wow from 'dummy/models/wow';

export default Route.extend({
    model: function() {
        return Wow.create();
    }
});
