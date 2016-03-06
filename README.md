# ember-cli-simple-store

[![Build Status][]](https://travis-ci.org/toranb/ember-cli-simple-store)
[![Downloads](https://img.shields.io/npm/dm/ember-cli-simple-store.svg)](https://www.npmjs.com/package/ember-cli-simple-store)
[![Score](http://emberobserver.com/badges/ember-cli-simple-store.svg)](http://emberobserver.com/addons/ember-cli-simple-store)

## Description

[ember-cli][] addon that provides a simple identity map for [ember.js][] web applications

## Installation

```
ember install ember-cli-simple-store
```

## You get 5 methods: push/remove/find/findOne/clear

```js
//create or update person model

simpleStore.push("person", {id: 1, name: "toran"});
```

```js
//remove person model with id=123

simpleStore.remove("person", 123);
```

```js
//find all person models

simpleStore.find("person");
```

```js
//find a single person model with id=123

simpleStore.find("person", 123);
```

```js
//find all person models with account_id=789

simpleStore.find("person", {account_id: 789});
```

```js
//find all person models with name toran and salary > 100

var filter = function(person) {
    var name = person.get("name");
    var salary = person.get("salary");
    return name === "toran" && salary > 100;
}
simpleStore.find("person", filter);
```

```js
//find the first person model

simpleStore.findOne("person");
```

```js
//clear the entire identity map of all person models

simpleStore.clear("person");
```

```js
//clear the entire identity map of all models

simpleStore.clear();
```

## Using the store by example

Below I'll show how you can use the store with a simple ember object to find/add/remove/update

The full example below relies on a small xhr addon [PromiseMixin][]

```js
import Ember from "ember";
import PromiseMixin from "ember-promise/mixins/promise";

var PersonRepository = Ember.Object.extend({
    simpleStore: Ember.inject.service(),
    find() {
        var simpleStore = this.get("simpleStore");
        return PromiseMixin.xhr("/api/people/", "GET").then(function(response) {
            response.forEach(function(person) {
                simpleStore.push("person", person);
            });
            return simpleStore.find("person");
        });
    },
    findById(id) {
        var simpleStore = this.get("simpleStore");
        return simpleStore.find("person", id);
    },
    insert(person) {
        var simpleStore = this.get("simpleStore");
        var hash = {data: JSON.stringify(person)};
        return new Ember.RSVP.Promise(function(resolve,reject) {
            return PromiseMixin.xhr("/api/people/", "POST", hash).then(function(persisted) {
                var inserted = simpleStore.push("person", persisted);
                resolve(inserted);
            }, function(err) {
                reject(err);
            });
        });
    },
    update(person) {
        var person_id = person.get("id");
        var hash = {data: JSON.stringify(person)};
        var endpoint = "/api/people/%@/".fmt(person_id);
        return PromiseMixin.xhr(endpoint, "PUT", hash);
    },
    remove(person) {
        var simpleStore = this.get("simpleStore");
        var person_id = person.get("id");
        var endpoint = "/api/people/%@/".fmt(person_id);
        return new Ember.RSVP.Promise(function(resolve,reject) {
            return PromiseMixin.xhr(endpoint, "DELETE").then(function(arg) {
                simpleStore.remove("person", person_id);
                resolve(arg);
            }, function(err) {
                reject(err);
            });
        });
    }
});

export default PersonRepository;
```

## What about relationship support?

A one-to-many example might look something like this

```js
import Ember from 'ember';

export default Ember.Object.extend({
    simpleStore: Ember.inject.service(),
    role: Ember.computed.alias('belongs_to.firstObject'),
    belongs_to: Ember.computed(function() {
        let userId = this.get('id');
        let simpleStore = this.get('simpleStore');
        let filter = function(role) {
            let users = role.get('users');
            return Ember.$.inArray(userId, users) > -1;
        };
        return simpleStore.find('role', filter);
    })
});

//a test to show how this api works from the outside

test('role property returns associated model or undefined', function(assert) {
    let user = simpleStore.push('user', {id: 1});
    simpleStore.push('role', {id: 2, name: 'Admin', users: [1]});
    let role = user.get('role');
    assert.equal(role.get('id'), 2);
    assert.equal(role.get('name'), 'Admin');
    role.set('users', []);
    role = user.get('role');
    assert.equal(role, undefined);
});
```

## What about dirty tracking?

If you want the ability to track if your model is dirty use the attr for each field and the Model to get save/rollback

```js
import { attr, Model } from "ember-cli-simple-store/model";

var Person = Model.extend({
    firstName: attr(),
    lastName: attr(),
    fullName: function() {
        var first = this.get("firstName");
        var last = this.get("lastName");
        return first + " " + last;
    }.property("firstName", "lastName")
});

//save your object to reset isDirty
var person = Person.create({id: 1, firstName: "x", lastName: "y"});
person.set("firstName", "toran");
person.save();

//rollback your object to reset isDirty and restore it
person.set("firstName", "foobar");
person.rollback();
```

If you want to know if an individual property isDirty you can ask like so

```js
person.get("firstNameIsDirty"); //undefined
person.set("firstName", "foobar");
person.get("firstNameIsDirty"); //true
```

For new forms that start with undefined properties you can define the default state for isDirty. Example: you have a model that is bound to a form with a checkbox input. The create form starts with a new model so each bound property is undefined. If the user decides to check the bound checkbox (setting the value to true) and then decides to uncheck it (setting the value to false) you would expect the form is not dirty - but because undefined !== false you find the model is dirty. To prevent this behavior set a default value for dirty tracking on the models attr like so.

```js
var Animal = Model.extend({
    omnivore: attr(false)
});

var animal = Animal.create();

animal.get("omnivore"); //undefined
animal.get("isDirty"); //false
animal.set("omnivore", true);
animal.get("isDirty"); //true
animal.set("omnivore", false);
animal.get("isDirty"); //false
```

## Example applications

**Simplest example with the least amount of complexity (tests included)**

https://github.com/toranb/kanban-board-without-ember-data

**Simple example running ember 2.4**

https://github.com/toranb/ember-2-skeleton-app

**Async example that will paint right away (loading section included w/ tests)**

https://github.com/toranb/async-kanban-board-store-example

**Async example with relationships (loading section included w/ tests)**

https://github.com/toranb/async-kanban-with-relationships-store-example

**Dirty tracking example with both save and rollback**

https://github.com/toranb/ember-cli-store-dirty-tracking-example

## Running the unit tests

    npm install
    ember test

## License

Copyright © 2015 Toran Billups http://toranbillups.com

Licensed under the MIT License


[Build Status]: https://travis-ci.org/toranb/ember-cli-simple-store.svg?branch=master
[ember-cli]: http://www.ember-cli.com/
[ember.js]: http://emberjs.com/
[PromiseMixin]: https://github.com/toranb/ember-promise
