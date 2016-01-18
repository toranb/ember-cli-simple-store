import Ember from "ember";
import getOwner from "ember-getowner-polyfill";
import RecordProxy from './record-proxy';
import RecordArray from './record-array';
import FilteredRecordArray from './filtered-record-array';

const { run, get, setProperties, assert } = Ember;

function buildRecord(type, data, store) {
    var containerKey = "model:" + type;
    var factory = getOwner(store)._lookupFactory(containerKey);

    assert("No model was found for type: " + type, factory);

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
        this.reset();
    },
    reset() {
      this.set("recompute", Ember.A());
      this.set("filtersMap", {});
      this.set("identityMap", {});
      this.set("array", {});
    },
    clear(type) {
        if (type === undefined) {
            this.reset();
        }

        delete this.get("identityMap")[type];
        arrayForType(type, this).clear();
        this.scheduleUpdate(type);
    },
    remove(type, id) {
        var record = this._findById(type, id);
        if (record) {
            delete this.get("identityMap")[type][record.id];
            arrayForType(type, this).removeObject(record);
            this.scheduleUpdate(type);
        }
    },
    push(type, data) {
        var record = this._findById(type, data.id);

        if (record) {
            setProperties(record, data);
        } else {
            record = buildRecord(type, data, this);
        }

        this.scheduleUpdate(type);

        return record;
    },
    scheduleUpdate(type) {
        var recompute = this.get("recompute");
        recompute.addObject(type);
        run.scheduleOnce('actions', this, 'updateFilters');
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
    unsubscribe(...args) {
        var updatedFiltersMap;
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

            assert("No key was found in the filter options", params.length);

            var attr = params[0];
            var value = options[attr];

            return this._findWithFilterFunc(type, function filterFunction(m) {
                return get(m, attr) === value;
            });
        }

        return this._findByIdComputed(type, options);
    },
    findOne(type) {
        return RecordProxy.create({
            store: this,
            type: type,
            source: this._findAll(type),
            compute() {
              return this.get("source").objectAt(0);
            }
        });
    },
    _findById(type, id) {
        var identityMap = identityMapForType(type, this);
        return identityMap[id] || null;
    },
    _findAll(type) {
        return arrayForType(type, this);
    },
    _findAllProxy(type) {
        return RecordArray.create({
            type: type,
            store: this,
            source: this._findAll(type)
        });
    },
    _findWithFilterFunc(type, filter_func) {
        var func = FilteredRecordArray.create({
            type: type,
            store: this,
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
        var actualId = this._coerceId(id);

        return RecordProxy.create({
            store: this,
            type: type,
            filter_value: actualId,
            source: this._findAll(type),
            compute() {
                var filter_value = this.get("filter_value");
                return this.get("source").findBy("id", filter_value);
            }
        });
    }
});

export default Store;
