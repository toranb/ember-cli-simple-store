# ember-cli-simple-store

[![Build Status][]](https://travis-ci.org/toranb/ember-cli-simple-store)
[![Downloads](https://img.shields.io/npm/dm/ember-cli-simple-store.svg)](https://www.npmjs.com/package/ember-cli-simple-store)
[![Score](http://emberobserver.com/badges/ember-cli-simple-store.svg)](http://emberobserver.com/addons/ember-cli-simple-store)

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

## You get 5 methods: push/remove/find/findOne/clear

```js
//create or update person model

store.push("person", {id: 1, name: "toran"});
```

```js
//remove person model with id=123

store.remove("person", 123);
```

```js
//find all person models

store.find("person");
```

```js
//find a single person model with id=123

store.find("person", 123);
```

```js
//find all person models with account_id=789

store.find("person", {account_id: 789});
```

```js
//find all person models with name toran and salary > 100

var filter = function(person) {
    var name = person.get("name");
    var salary = person.get("salary");
    return name === "toran" && salary > 100;
}
store.find("person", filter, ["salary", "name"]);
```

```js
//find the first person model

store.findOne("person");
```

```js
//clear the entire identity map of all person models

store.clear("person");
```

```js
//clear the entire identity map of all models

store.clear();
```

## Using the store by example

Below I'll show how you can use the store with a simple ember object to find/add/remove/update

The full example below relies on a small xhr addon [PromiseMixin][]

```js
import Ember from "ember";
import PromiseMixin from "ember-promise/mixins/promise";

var PersonRepository = Ember.Object.extend({
    find: function() {
        var store = this.get("store");
        return PromiseMixin.xhr("/api/people/", "GET").then(function(response) {
            response.forEach(function(person) {
                store.push("person", person);
            });
            return store.find("person");
        });
    },
    findById: function(id) {
        var store = this.get("store");
        return store.find("person", id);
    },
    insert: function(person) {
        var self = this;
        var store = this.get("store");
        var hash = {data: JSON.stringify(person)};
        return new Ember.RSVP.Promise(function(resolve,reject) {
            return PromiseMixin.xhr("/api/people/", "POST", hash).then(function(persisted) {
                var inserted = store.push("person", persisted);
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
        return PromiseMixin.xhr(endpoint, "PUT", hash);
    },
    remove: function(person) {
        var self = this;
        var store = this.get("store");
        var person_id = person.get("id");
        var endpoint = "/api/people/%@/".fmt(person_id);
        return new Ember.RSVP.Promise(function(resolve,reject) {
            return PromiseMixin.xhr(endpoint, "DELETE").then(function(arg) {
                store.remove("person", person_id);
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

With this simple reference implementation you can side step the relationship complexity by adding what you need in your route(s)

```js
import Action from "js/models/action";
import Person from "js/models/person";

var PeoplePersonRoute = Ember.Route.extend({
  model: function(params) {
    var store = this.get("store");
    var person = Person.findById(store, params.person_id);
    //in findByPerson you could simply filter down objects for the parent
    var actions = Action.findByPerson(store, params.person_id);
    return Ember.RSVP.hash({person: person, actions: actions});
  },
  setupController: function(controller, hash) {
    controller.set("model", hash.person);
    controller.set("actions", hash.actions);
  }
});

export default PeoplePersonRoute;
```

This approach is not without it's tradeoffs

* additional http calls to fetch related data instead of using embedded json. Or you can make a single http call and parse this out if latency becomes problematic but you might find yourself managing complex object hierarchies all over again.
* you will need to inject the store instance into each class that does data access (service/repository for example).

I've personally found this is a great approach for apps that want to avoid the complexity of bigger projects like ember-data, but still need a single pointer /reference for the models in your ember application.

## What about dirty tracking?

If you want the ability to track if your model is dirty use the attr for each field and the Model base class to get save/rollback

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

## Running the unit tests

    npm install
    ember test

## Example project

https://github.com/toranb/ember-cli-store-example

## Example project with dirty tracking (save/rollback)

https://github.com/toranb/ember-cli-store-dirty-tracking-example

## License

Copyright © 2015 Toran Billups http://toranbillups.com

Licensed under the MIT License


[Build Status]: https://travis-ci.org/toranb/ember-cli-simple-store.svg?branch=master
[ember-cli]: http://www.ember-cli.com/
[ember.js]: http://emberjs.com/
[PromiseMixin]: https://github.com/toranb/ember-promise
