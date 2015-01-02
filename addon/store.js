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
        delete this.get("identityMap")[type];
        arrayForType(type, this).clear();
    },
    push: function(type, data) {
        var record = this._getById(type, data.id);
        if (record) {
            record.setProperties(data);
        } else {
            record = buildRecord(type, data, this);
        }
        return record;
    },
    remove: function(type, id) {
        var record = this._getById(type, id);
        if (record) {
            delete this.get("identityMap")[type][record.id];
            arrayForType(type, this).removeObject(record);
        }
    },
    find: function(type, options) {
        if (typeof options === "undefined") {
            return this._getEverything(type);
        }
        if (typeof options === "object") {
            var params = Object.keys(options);

            Ember.assert("No key was found in the filter options", params.length);

            var attr = params[0];
            var value = options[attr];
            return this._filterEverything(type, attr, value);
        }
        return this._getById(type, options);
    },
    _getById: function(type, id) {
        var identityMap = identityMapForType(type, this);
        return identityMap[id] || null;
    },
    _getEverything: function(type) {
        return arrayForType(type, this);
    },
    _filterEverything: function(type, filter_attr, filter_value) {
        var computed_string = "source.@each." + filter_attr;
        return Ember.ArrayProxy.extend({
          source: undefined,
          content: function () {
            var filter_value = this.get("filter_value");
            return this.get("source").filterBy(filter_attr, filter_value);
          }.property(computed_string)
        }).create({
          filter_value: filter_value,
          source: this._getEverything(type)
        });
    }
});

export default Store;
