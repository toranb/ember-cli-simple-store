import Ember from "ember";
import getOwner from "ember-getowner-polyfill";
import RecordProxy from './models/record-proxy';
import RecordArray from './models/record-array';
import FilteredRecordArray from './models/filtered-record-array';

const { run, get, setProperties, assert } = Ember;

function buildRecord(type, data, store) {
    var factory = factoryForType(type, store);
    var primaryKey = primaryKeyForType(type, store);

    assert("No model was found for type: " + type, factory);

    var record = factory.create(data);
    var id = data[primaryKey];
    identityMapForType(type, store)[id] = record;
    arrayForType(type, store).pushObject(record);

    return record;
}

function factoryForType(type, store) {
    return getOwner(store)._lookupFactory("model:" + type);
}

function primaryKeyForType(type, store) {
    return (factoryForType(type, store) || {}).primaryKey || 'id';
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

const ServiceType = Ember.Service || Ember.Object;

var Store = ServiceType.extend({
    init() {
        this._super(...arguments);
        this.reset();
    },
    reset() {
      this.set("recompute", Ember.A());
      this.set("filtersMap", {});
      this.set("identityMap", {});

      var array = this.get("array") || {};
      Object.keys(array).forEach((type) => {
          arrayForType(type, this).forEach(record => record.destroy());
      });
      this.set("array", {});
    },
    willDestroy() {
        this.setProperties({
            "array": null,
            "identityMap": null,
            "filtersMap": null,
            "recompute": null
        });
    },
    clear(type) {
        if (type === undefined) {
            this.reset();
        }

        delete this.get("identityMap")[type];
        var records = arrayForType(type, this);
        records.forEach(record => record.destroy());
        records.clear();
        this.scheduleUpdate(type);
    },
    remove(type, id) {
        var record = this._findById(type, id);
        if (record) {
            var primaryKey = primaryKeyForType(type, this);
            delete this.get("identityMap")[type][record[primaryKey]];
            arrayForType(type, this).removeObject(record);
            record.destroy();
            this.scheduleUpdate(type);
        }
    },
    push(type, data) {
        var primaryKey = primaryKeyForType(type, this);
        data[primaryKey] = this._coerceId(data[primaryKey]);
        var record = this._findById(type, data[primaryKey]);

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
        if (this.get('isDestroyed') || this.get('isDestroying')) {
            return;
        }
        var recompute = this.get("recompute");
        var filtersMap = this.get("filtersMap");

        Object.keys(filtersMap).forEach((type) => {
            var filters = filtersMap[type] || [];

            filters.forEach((recordArray) => {
                if (recompute.includes(type)) {
                    var updatedContent = recordArray.updateContent();
                    recordArray.set("content", updatedContent);
                }
            });
        });

        this.set("recompute", Ember.A());
    },
    _unsubscribe(...args) {
        var updatedFiltersMap;
        var filterIds = Ember.A(args.map((func) => {
            var primaryKey = primaryKeyForType(func.type, this);
            return func[primaryKey];
        }));
        var filtersMap = this.get("filtersMap");
        Object.keys(filtersMap).forEach((type) => {
            var primaryKey = primaryKeyForType(type, this);
            var filters = filtersMap[type] || [];
            updatedFiltersMap = filters.filter((func) => !filterIds.includes(func[primaryKey]));
            filtersMap[type] = updatedFiltersMap;
        });
    },
    find(type, options) {
        if (typeof options === "undefined") {
            return this._findAllProxy(type);
        }

        if (options instanceof Function) {
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
            _store: this,
            _type: type,
            _source: this._findAll(type),
            compute() {
              return this.get("_source").objectAt(0);
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
            _type: type,
            _store: this,
            _source: this._findAll(type)
        });
    },
    _findWithFilterFunc(type, filter_func) {
        var func = FilteredRecordArray.create({
            _type: type,
            _store: this,
            _id: Ember.uuid(),
            _filter_func: filter_func,
            _source: this._findAll(type)
        });
        var filtersMap = this.get("filtersMap");
        var filters = filtersMap[type] || [];
        filters.push(func);
        filtersMap[type] = filters;
        return func;
    },
    _coerceId(id) {
        var numberId = Number(id);
        if (!isNaN(numberId) && numberId.toString().length === id.toString().length) {
            return numberId;
        }
        return id;
    },
    _findByIdComputed(type, id) {
        var actualId = this._coerceId(id);
        var primaryKey = primaryKeyForType(type, this);

        return RecordProxy.create({
            _store: this,
            _type: type,
            _filter_value: actualId,
            _source: this._findAll(type),
            compute() {
                var filter_value = this.get("_filter_value");
                return this.get("_source").findBy(primaryKey, filter_value);
            }
        });
    }
});

export default Store;
