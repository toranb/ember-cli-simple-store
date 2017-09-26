import Service from '@ember/service';
import { A } from '@ember/array';
import { run } from '@ember/runloop';
import EmberObject, { setProperties, get } from '@ember/object';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import Ember from "ember";
import RecordProxy from "./models/record-proxy";
import RecordArray from "./models/record-array";
import FilteredRecordArray from "./models/filtered-record-array";

function buildRecord(type, data, store) {
    let record = createRecord(type, data, store);
    arrayForType(type, store).pushObject(record);

    return record;
}

function createRecord(type, data, store) {
  let factory = factoryForType(type, store);
  let primaryKey = primaryKeyForType(type, store);

  assert("No model was found for type: " + type, factory);

  let record = factory.create(data);
  let id = data[primaryKey];
  identityMapForType(type, store)[id] = record;

  return record;
}

function factoryForType(type, store) {
    return getOwner(store).factoryFor("model:" + type);
}

function primaryKeyForType(type, store) {
    const factory = factoryForType(type, store) || {};
    // http://emberjs.com/deprecations/v2.x/#toc_migrating-from-_lookupfactory-to-factoryfor
    return factory.class && (factory.class.primaryKey || 'id');
}

function arrayForType(type, store) {
    let all = store.get("array");
    let models = all[type] || [];
    all[type] = models;
    return A(models);
}

function identityMapForType(type, store) {
    let typeIdentityMap = store.get("identityMap");
    let idIdentityMap = typeIdentityMap[type] || {};
    typeIdentityMap[type] = idIdentityMap;

    return idIdentityMap;
}

const ServiceType = Service || EmberObject;

let Store = ServiceType.extend({
    init() {
        this._super(...arguments);
        this.reset();
    },
    reset() {
      this.set("recompute", A());
      this.set("filtersMap", {});
      this.set("identityMap", {});

      let array = this.get("array") || {};
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
        let records = arrayForType(type, this);
        records.forEach(record => record.destroy());
        records.clear();
        this.scheduleUpdate(type);
    },
    remove(type, id) {
        let record = this._findById(type, id);
        if (record) {
            let primaryKey = primaryKeyForType(type, this);
            delete this.get("identityMap")[type][record[primaryKey]];
            arrayForType(type, this).removeObject(record);
            record.destroy();
            this.scheduleUpdate(type);
        }
    },
    push(type, data) {
        let primaryKey = primaryKeyForType(type, this);
        data[primaryKey] = this._coerceId(data[primaryKey]);
        let record = this._findById(type, data[primaryKey]);

        if (record) {
            setProperties(record, data);
        } else {
            record = buildRecord(type, data, this);
        }

        this.scheduleUpdate(type);

        return record;
    },
    pushArray(type, dataArray) {
        let primaryKey = primaryKeyForType(type, this);
        let records = [];

        dataArray.forEach((data) => {
            data[primaryKey] = this._coerceId(data[primaryKey]);
            let record = this._findById(type, data[primaryKey]);

            if (record) {
                setProperties(record, data);
            } else {
                record = createRecord(type, data, this);
                records.push(record);
            }
        });

        arrayForType(type, this).pushObjects(records);

        this.scheduleUpdate(type);

        return records;
    },
    scheduleUpdate(type) {
        let recompute = this.get("recompute");
        recompute.addObject(type);
        run.scheduleOnce('actions', this, 'updateFilters');
    },
    updateFilters() {
        if (this.get('isDestroyed') || this.get('isDestroying')) {
            return;
        }
        let recompute = this.get("recompute");
        let filtersMap = this.get("filtersMap");

        Object.keys(filtersMap).forEach((type) => {
            let filters = filtersMap[type] || [];

            filters.forEach((recordArray) => {
                if (recompute.includes(type)) {
                    let updatedContent = recordArray.updateContent();
                    recordArray.set("content", updatedContent);
                }
            });
        });

        this.set("recompute", A());
    },
    _unsubscribe(...args) {
        let updatedFiltersMap;
        let filterIds = A(args.map((func) => {
            let primaryKey = primaryKeyForType(func.type, this);
            return func[primaryKey];
        }));
        let filtersMap = this.get("filtersMap");
        Object.keys(filtersMap).forEach((type) => {
            let primaryKey = primaryKeyForType(type, this);
            let filters = filtersMap[type] || [];
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
            let params = Object.keys(options);

            assert("No key was found in the filter options", params.length);

            let attr = params[0];
            let value = options[attr];

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
        let identityMap = identityMapForType(type, this);
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
        let func = FilteredRecordArray.create({
            _type: type,
            _store: this,
            _id: Ember.uuid(),
            _filter_func: filter_func,
            _source: this._findAll(type)
        });
        let filtersMap = this.get("filtersMap");
        let filters = filtersMap[type] || [];
        filters.push(func);
        filtersMap[type] = filters;
        return func;
    },
    _coerceId(id) {
        let numberId = Number(id);
        if (!isNaN(numberId) && numberId.toString().length === id.toString().length) {
            return numberId;
        }
        return id;
    },
    _findByIdComputed(type, id) {
        let actualId = this._coerceId(id);
        let primaryKey = primaryKeyForType(type, this);

        return RecordProxy.create({
            _store: this,
            _type: type,
            _filter_value: actualId,
            _source: this._findAll(type),
            compute() {
                let filter_value = this.get("_filter_value");
                return this.get("_source").findBy(primaryKey, filter_value);
            }
        });
    }
});

export default Store;
