import Ember from "ember";
import getOwner from "ember-getowner-polyfill";

function buildRecord(type, data, store) {
    var containerKey = "model:" + type;
    var factory = getOwner(store)._lookupFactory(containerKey);

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
    return Ember.A(models);
}

function identityMapForType(type, store) {
    var typeIdentityMap = store.get("identityMap");
    var idIdentityMap = typeIdentityMap[type] || {};
    typeIdentityMap[type] = idIdentityMap;
    return idIdentityMap;
}

var Store = Ember.Object.extend({
    init: function() {
        this.set("recompute", []);
        this.set("filtersMap", {});
        this.set("identityMap", {});
        this.set("array", {});
    },
    clear: function(type) {
        if(type === undefined) {
            this.init();
        }
        delete this.get("identityMap")[type];
        arrayForType(type, this).clear();

        Ember.run.once(() => {
            this.scheduleUpdate(type);
        });
    },
    remove: function(type, id) {
        var record = this._findById(type, id);
        if (record) {
            delete this.get("identityMap")[type][record.id];
            arrayForType(type, this).removeObject(record);

            Ember.run.once(() => {
                this.scheduleUpdate(type);
            });
        }
    },
    push: function(type, data) {
        var record = this._findById(type, data.id);
        if (record) {
            record.setProperties(data);
        } else {
            record = buildRecord(type, data, this);
        }

        Ember.run.once(() => {
            this.scheduleUpdate(type);
        });

        return record;
    },
    scheduleUpdate: function(type) {
        var recompute = this.get("recompute");
        recompute.push(type);
        Ember.run.scheduleOnce("actions", this, "updateFilters");
    },
    updateFilters: function() {
        var recompute = this.get("recompute");
        var filtersMap = this.get("filtersMap");
        Object.keys(filtersMap).forEach(function(type) {
            var filters = filtersMap[type] || [];
            filters.forEach(function(func) {
                if(Ember.$.inArray(type, recompute) > -1) {
                    var updatedContent = func.updateContent();
                    func.set('content', Ember.A(updatedContent));
                }
            });
        });
        this.set("recompute", []);
    },
    find: function(type, options) {
        if (typeof options === "undefined") {
            return this._findAllProxy(type);
        }
        if (options instanceof Function) {
            // var computed_keys = arguments[2] || [];
            // Ember.deprecate("find with filter no longer requires an array of computed keys", computed_keys);
            return this._findWithFilterFunc(type, options, true);
        }
        if (typeof options === "object") {
            var params = Object.keys(options);

            Ember.assert("No key was found in the filter options", params.length);

            var attr = params[0];
            var value = options[attr];
            var func = function(m) {
                return m.get(attr) === value;
            };
            return this._findWithFilterFunc(type, func);
        }
        return this._findByIdComputed(type, options);
    },
    _findById: function(type, id) {
        var identityMap = identityMapForType(type, this);
        return identityMap[id] || null;
    },
    _findAll: function(type) {
        return arrayForType(type, this);
    },
    _findAllProxy: function(type) {
        return Ember.ArrayProxy.extend({
          push: function(type, data) {
              return this.push(type, data);
          }.bind(this, type),
          remove: function(type, id) {
              this.remove(type, id);
          }.bind(this, type),
          content: Ember.computed(function () {
            return Ember.A(this.get("source"));
          })
        }).create({
          source: this._findAll(type)
        });
    },
    _findWithFilterFunc: function(type, filter_func, cache) {
        var filtersMap = this.get("filtersMap");
        var filters = filtersMap[type] || [];
        if(cache) {
            var exists = filters.filter(function(fn) {
                return fn.filter_func.toString() === filter_func.toString();
            })[0];
            if(exists) {
                return exists;
            }
        }
        var func = Ember.ArrayProxy.extend({
          push: function(type, data) {
             return this.push(type, data);
          }.bind(this, type),
          remove: function(type, id) {
              this.remove(type, id);
          }.bind(this, type),
          updateContent: function() {
              var source = this.get("source");
              var filter_func = this.get("filter_func");
              return source.filter(filter_func);
          },
          content: Ember.computed(function () {
              var source = this.get("source");
              var filter_func = this.get("filter_func");
              return Ember.A(source.filter(filter_func));
          })
        }).create({
            filter_func: filter_func,
            source: this._findAll(type)
        });
        filters.push(func);
        filtersMap[type] = filters;
        return func;
    },
    _coerceId: function(id) {
        var numberId = parseInt(id, 10);
        if (numberId && numberId.toString().length === id.toString().length) {
            return numberId;
        }
        return id;
    },
    _findByIdComputed: function(type, id) {
        var store = this;
        var actualId = this._coerceId(id);
        return Ember.ObjectProxy.extend({
            content: Ember.computed("source.[]", function() {
                var filter_value = this.get("filter_value");
                var list = Ember.A(this.get("source").filterBy("id", filter_value));
                return list.objectAt(0);
            })
        }).create({
            filter_value: actualId,
            source: this._findAll(type),
            init: function () {
                var model = getOwner(store).lookup("model:" + type);
                for(var method in model) {
                    if(typeof model[method] === "function") {
                        if(!this[method]) {
                            this.proxyMethod(method);
                        }
                    }
                }
            },
            proxyMethod: function(method) {
                this[method] = function() {
                    var content = this.get("content");
                    return content[method].apply(content, arguments);
                };
            }
        });
    },
    findOne: function(type) {
        var store = this;
        return Ember.ObjectProxy.extend({
            content: Ember.computed("source.[]", function() {
                return this.get("source").objectAt(0);
            })
        }).create({
            source: this._findAll(type),
            init: function () {
                var model = getOwner(store).lookup("model:" + type);
                for(var method in model) {
                    if(typeof model[method] === "function") {
                        if(!this[method]) {
                            this.proxyMethod(method);
                        }
                    }
                }
            },
            proxyMethod: function(method) {
                this[method] = function() {
                    var content = this.get("content");
                    return content[method].apply(content, arguments);
                };
            }
        });
    }
});

export default Store;
