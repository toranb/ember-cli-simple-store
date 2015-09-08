import Store from '../store';

export default function() {
    var application = arguments[1] || arguments[0];
    application.register('store:main', Store);
    application.inject('controller', 'store', 'store:main');
    application.inject('route', 'store', 'store:main');
}
