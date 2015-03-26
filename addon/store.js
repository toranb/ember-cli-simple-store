import Ember from "ember";

function buildRecord(type, data, store) {
    var containerKey = "model:" + type;
    var factory = store.container.lookupFactory(containerKey);

    Ember.assert("No model was found for type: " + type, factory);

    var record = factory.create(data);
    var id = data.id;
    identityMapForType(type, store)[id] = record;
    arrayForType(type, store).pushObject(record);
    return record;
}

function arrayForType(type, store) {
    var all = store.get("array");
    var models = all[type] || [];
    all[type] = models;
    return models;
}

function identityMapForType(type, store) {
    var typeIdentityMap = store.get("identityMap");
    var idIdentityMap = typeIdentityMap[type] || {};
    typeIdentityMap[type] = idIdentityMap;
    return idIdentityMap;
}

var Store = Ember.Object.extend({
    init: function() {
        this.set("identityMap", {});
        this.set("array", {});
    },
    clear: function(type) {
        if(type === undefined) {
            this.init();
        }
        delete this.get("identityMap")[type];
        arrayForType(type, this).clear();
    },
    push: function(type, data) {
        var record = this._findById(type, data.id);
        if (record) {
            record.setProperties(data);
        } else {
            record = buildRecord(type, data, this);
        }
        return record;
    },
    remove: function(type, id) {
        var record = this._findById(type, id);
        if (record) {
            delete this.get("identityMap")[type][record.id];
            arrayForType(type, this).removeObject(record);
        }
    },
    find: function(type, options) {
        if (typeof options === "undefined") {
            return this._findAll(type);
        }
        if (options instanceof Function) {
            var computed_keys = arguments[2];
            Ember.assert("No computed keys found for the filter by function", computed_keys);
            return this._findWithFilterFunc(type, options, computed_keys);
        }
        if (typeof options === "object") {
            var params = Object.keys(options);

            Ember.assert("No key was found in the filter options", params.length);

            var attr = params[0];
            var value = options[attr];
            return this._findWithFilter(type, attr, value);
        }
        return this._findByIdComputed(type, options);
    },
    findOne: function(type) {
        var all = this._findAll(type);
        return all.length > 0 ? all.objectAt(0) : null;
    },
    _findByIdComputed: function(type, id) {
        var actualId = this._parseAndTransformId(id);
        return Ember.ObjectProxy.extend({
          content: function() {
            var filter_value = this.get("filter_value");
            return this.get("source").filterBy("id", filter_value).objectAt(0);
          }.property("source.[]")
        }).create({
          filter_value: actualId,
          source: this._findAll(type)
        });
    },
    _findById: function(type, id) {
        var identityMap = identityMapForType(type, this);
        return identityMap[id] || null;
    },
    _findAll: function(type) {
        return arrayForType(type, this);
    },
    _findWithFilter: function(type, filter_attr, filter_value) {
        var computed_string = "source.@each." + filter_attr;
        return Ember.ArrayProxy.extend({
          content: function () {
            var filter_value = this.get("filter_value");
            return this.get("source").filterBy(filter_attr, filter_value);
          }.property(computed_string)
        }).create({
          filter_value: filter_value,
          source: this._findAll(type)
        });
    },
    _findWithFilterFunc: function(type, filter_func, computed_keys) {
        var attributes = [];
        computed_keys.forEach(function(computed_key) {
            attributes.push("source.@each." + computed_key);
        });
        return Ember.ArrayProxy.extend({
          content: function () {
            var filter_func = this.get("filter_func");
            return this.get("source").filter(filter_func);
          }.property("" + attributes)
        }).create({
          filter_func: filter_func,
          source: this._findAll(type)
        });
    },
    _parseAndTransformId: function(id) {
        var numberId = parseInt(id, 10);
        if (numberId && numberId.toString().length === id.toString().length) {
            return numberId;
        }
        return id;
    }
});

export default Store;
