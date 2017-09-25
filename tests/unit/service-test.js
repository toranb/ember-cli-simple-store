import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import SimpleStore from 'ember-cli-simple-store/store';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:simple-store', 'Unit | Service | simple-store');

test("it exists", function(assert) {
    assert.ok(this.subject(), 'a service exists');
});

test("it is an instance of ember-cli-simple-store/store", function(assert) {
    assert.ok(this.subject() instanceof SimpleStore, 'a service is an instance of SimpleStore');
});

test("it is injectable", function(assert) {
    this.register('controller:injection-subject', Controller.extend({
        simpleStore: service()
    }));

    let subject = this.container.lookup('controller:injection-subject');
    assert.ok(subject.get('simpleStore') instanceof SimpleStore);
});
