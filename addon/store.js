import Ember from "ember";
import getOwner from "ember-getowner-polyfill";

const { computed, ArrayProxy, run, get } = Ember;

function buildRecord(type, data, store) {
    var containerKey = "model:" + type;
    var factory = getOwner(store)._lookupFactory(containerKey);

    Ember.assert("No model was found for type: " + type, factory);

    var record = factory.create(data);
    var { id } = data;
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
    init() {
        this._super(...arguments);
        this.set("recompute", Ember.A());
        this.set("filtersMap", {});
        this.set("identityMap", {});
        this.set("array", {});
    },
    clear(type) {
        if(type === undefined) {
            this.init();
        }
        delete this.get("identityMap")[type];
        arrayForType(type, this).clear();

        run.once(() => {
            this.scheduleUpdate(type);
        });
    },
    remove(type, id) {
        var record = this._findById(type, id);
        if (record) {
            delete this.get("identityMap")[type][record.id];
            arrayForType(type, this).removeObject(record);

            run.once(() => {
                this.scheduleUpdate(type);
            });
        }
    },
    push(type, data) {
        var record = this._findById(type, data.id);
        if (record) {
            record.setProperties(data);
        } else {
            record = buildRecord(type, data, this);
        }

        run.once(() => {
            this.scheduleUpdate(type);
        });

        return record;
    },
    scheduleUpdate(type) {
        var recompute = this.get("recompute");
        recompute.push(type);
        run.scheduleOnce("actions", this, "updateFilters");
    },
    updateFilters() {
        var recompute = this.get("recompute");
        var filtersMap = this.get("filtersMap");
        Object.keys(filtersMap).forEach((type) => {
            var filters = filtersMap[type] || [];
            filters.forEach((func) => {
                if (recompute.contains(type)) {
                    var updatedContent = func.updateContent();
                    func.set("content", Ember.A(updatedContent));
                }
            });
        });

        this.set("recompute", Ember.A());
    },
    unsubscribe() {
        var updatedFiltersMap;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; ++_key) {
            args[_key] = arguments[_key];
        }
        var filterIds = Ember.A(args.map((func) => func.id));
        var filtersMap = this.get("filtersMap");
        Object.keys(filtersMap).forEach((type) => {
            var filters = filtersMap[type] || [];
            updatedFiltersMap = filters.filter((func) => !filterIds.contains(func.id));
            filtersMap[type] = updatedFiltersMap;
        });
    },
    find(type, options) {
        if (typeof options === "undefined") {
            return this._findAllProxy(type);
        }
        if (options instanceof Function) {
            // var computed_keys = arguments[2] || [];
            // Ember.deprecate("find with filter no longer requires an array of computed keys", computed_keys);
            return this._findWithFilterFunc(type, options);
        }
        if (typeof options === "object") {
            var params = Object.keys(options);

            Ember.assert("No key was found in the filter options", params.length);

            var attr = params[0];
            var value = options[attr];
            var func = function(m) {
                return get(m, attr) === value;
            };
            return this._findWithFilterFunc(type, func);
        }
        return this._findByIdComputed(type, options);
    },
    _findById(type, id) {
        var identityMap = identityMapForType(type, this);
        return identityMap[id] || null;
    },
    _findAll(type) {
        return arrayForType(type, this);
    },
    _findAllProxy(type) {
        var store = this;
        return ArrayProxy.extend({
          push(data) {
              return store.push(type, data);
          },
          remove(id) {
              store.remove(type, id);
          },
          content: computed(function () {
              return Ember.A(this.get("source"));
          })
        }).create({
            source: this._findAll(type)
        });
    },
    _findWithFilterFunc(type, filter_func) {
        var store = this;
        var func = ArrayProxy.extend({
          push(data) {
             return store.push(type, data);
          },
          remove(id) {
              store.remove(type, id);
          },
          updateContent() {
              var source = this.get("source");
              var filter_func = this.get("filter_func");
              return source.filter(filter_func);
          },
          content: computed(function () {
              var source = this.get("source");
              var filter_func = this.get("filter_func");
              return Ember.A(source.filter(filter_func));
          })
        }).create({
            id: Ember.uuid(),
            filter_func: filter_func,
            source: this._findAll(type)
        });
        var filtersMap = this.get("filtersMap");
        var filters = filtersMap[type] || [];
        filters.push(func);
        filtersMap[type] = filters;
        return func;
    },
    _coerceId(id) {
        var numberId = parseInt(id, 10);
        if (numberId && numberId.toString().length === id.toString().length) {
            return numberId;
        }
        return id;
    },
    _findByIdComputed(type, id) {
        var store = this;
        var actualId = this._coerceId(id);

        return Ember.ObjectProxy.extend({
            content: computed("source.[]", function() {
                var filter_value = this.get("filter_value");
                var list = Ember.A(this.get("source").filterBy("id", filter_value));
                return list.objectAt(0);
            })
        }).create({
            filter_value: actualId,
            source: this._findAll(type),
            init() {
                var model = getOwner(store).lookup(`model:${type}`);
                for(var method in model) {
                    if(typeof model[method] === "function") {
                        if(!this[method]) {
                            this.proxyMethod(method);
                        }
                    }
                }
            },
            proxyMethod(method) {
                this[method] = function() {
                    var content = this.get("content");
                    return content[method].apply(content, arguments);
                };
            }
        });
    },
    findOne(type) {
        var store = this;

        return Ember.ObjectProxy.extend({
            content: computed("source.[]", function() {
                return this.get("source").objectAt(0);
            })
        }).create({
            source: this._findAll(type),
            init() {
                var model = getOwner(store).lookup(`model:${type}`);
                for(var method in model) {
                    if(typeof model[method] === "function") {
                        if(!this[method]) {
                            this.proxyMethod(method);
                        }
                    }
                }
            },
            proxyMethod(method) {
                this[method] = function() {
                    var content = this.get("content");
                    return content[method].apply(content, arguments);
                };
            }
        });
    }
});

export default Store;
