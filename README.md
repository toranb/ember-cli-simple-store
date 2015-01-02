# ember-cli-simple-store

[![Build Status][]](https://travis-ci.org/toranb/ember-cli-simple-store)

## Description

[ember-cli][] addon that provides a simple identity map for [ember.js][] web applications

## Installation

```
1) remove ember-data from your package.json file
2) remove ember-data from your bower.json file
3) rm -rf node_modules/ember-data
4) rm -rf bower_components/ember-data
5) npm install ember-cli-simple-store --save-dev
```

## The entire api consists of 4 methods: push/remove/find/clear

```js
//create a new person model

this.store.push("person", {id: 1, name: "toran"});
```

```js
//update an existing person model

this.store.push("person", {id: 1, name: "brandon"});
```

```js
//remove person model with id=123

this.store.remove("person", 123);
```

```js
//find all person models

this.store.find("person");
```

```js
//find a single person model with id=123

this.store.find("person", 123);
```

```js
//find all person models with account_id=789

this.store.find("person", {account_id: 789});
```

```js
//clear the entire identity map of all person model objects

this.store.clear("person");
```

## Using the store by example

Below I'll show how you can use the store with a simple ember object to find/add/remove/update

The full example below relies on a small xhr mixin [PromiseMixin][]

```js
import PromiseMixin from 'js/mixins/promise';

var Person = Ember.Object.extend({
    firstName: '',
    lastName: '',
    phone: ''
}).reopenClass(PromiseMixin, {
    find: function(store) {
        return this.xhr('/api/people/', 'GET').then(function(response) {
            response.forEach(function(person) {
                store.push('person', person);
            });
            return store.find('person');
        });
    },
    findById: function(store, id) {
        return store.find('person', id);
    },
    insert: function(store, person) {
        var self = this;
        var hash = {data: JSON.stringify(person)};
        return new Ember.RSVP.Promise(function(resolve,reject) {
            return self.xhr("/api/people/", "POST", hash).then(function(persisted) {
                var inserted = store.push('person', Person.create(persisted));
                resolve(inserted);
            }, function(err) {
                reject(err);
            });
        });
    },
    update: function(person) {
        var person_id = person.get("id");
        var hash = {data: JSON.stringify(person)};
        var endpoint = "/api/people/%@/".fmt(person_id);
        return this.xhr(endpoint, "PUT", hash);
    },
    remove: function(store, person) {
        var self = this;
        var person_id = person.get("id");
        var endpoint = "/api/people/%@/".fmt(person_id);
        return new Ember.RSVP.Promise(function(resolve,reject) {
            return self.xhr(endpoint, "DELETE").then(function(arg) {
                store.remove('person', person_id);
                resolve(arg);
            }, function(err) {
                reject(err);
            });
        });
    }
});

export default Person;
```

## What about relationship support?

With this simple reference implementation you can side step the relationship complexity by adding what you need in your route(s)

```js
import Action from "js/models/action";
import Person from "js/models/person";

var PeoplePersonRoute = Ember.Route.extend({
  model: function(params) {
    var store = this.get("store");
    var person = Person.findById(store, params.person_id);
    var actions = Action.findByPerson(store, params.person_id);
    return Ember.RSVP.hash({person: person, actions: actions});
  },
  setupController: function(controller, hash) {
    controller.set("model", hash.person);
    controller.set("actions", hash.actions);
  }
});
```

This approach is not without it's tradeoffs (ie- additional http calls to fetch related data instead of using embedded json for example). I've personally found this is a great approach for apps that want to avoid the "kitchen-sink" problem.

## What about the missing MyObject.save() abstraction

Because this is a simple identity map you won't get a rich model object to inherit from that offers up save/remove/update/find. You can think of this store as the primitive in which to build something like that if and when you need it.

## Running the unit tests

    npm install
    ember test

## Example project

https://github.com/toranb/ember-store-example

## License

Copyright © 2015 Toran Billups http://toranbillups.com

Licensed under the MIT License


[Build Status]: https://travis-ci.org/toranb/ember-cli-simple-store.svg?branch=master
[ember-cli]: http://www.ember-cli.com/
[ember.js]: http://emberjs.com/
[PromiseMixin]: https://gist.github.com/toranb/98abc9616f2abecde0d4
