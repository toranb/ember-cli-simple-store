import SimpleStoreService from '../services/simple-store';
import config from '../config/environment';

export default {
    name: 'simple-store',
    initialize() {
        var simpleStoreConfig = config['ember-cli-simple-store'] || {};

        if (simpleStoreConfig.disableAutoInject) {
            return;
        }

        var application = arguments[1] || arguments[0];
        application.register('service:simple-store', SimpleStoreService);
        application.inject('controller', 'store', 'service:simple-store');
        application.inject('route', 'store', 'service:simple-store');
    }
};
