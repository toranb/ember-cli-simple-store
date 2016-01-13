import Store from 'ember-cli-simple-store/store';
import config from '../config/environment';

export default {
    name: 'simple-store',
    initialize() {
        var simpleStoreConfig = config['ember-cli-simple-store'] || {};

        if (!simpleStoreConfig.disableAutoInject) {
            var application = arguments[1] || arguments[0];
            application.register('store:main', Store);
            application.inject('controller', 'store', 'store:main');
            application.inject('route', 'store', 'store:main');
        }
    }
};
