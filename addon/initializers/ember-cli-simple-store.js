import Store from '../store';

export default function(container, application) {
    application.register('store:main', Store);
    application.inject('controller', 'store', 'store:main');
    application.inject('route', 'store', 'store:main');
}
