import { not } from '@ember/object/computed';
import { isNone } from '@ember/utils';
import EmberObject, {
  get,
  defineProperty,
  computed
} from '@ember/object';

function equal(first, second) {
    if (first instanceof Array && second instanceof Array) {
        return first.length === second.length && first.every((v, i) => v === second[i]);
    }

    return first === second;
}

function factory(obj) {
    return obj.get("constructor.ClassMixin.ownerConstructor") || obj.constructor;
}

function attrs(obj) {
    let all = [];
    factory(obj).eachComputedProperty(function (key, meta) {
        if (meta.isAttribute) {
            all.push(key);
        }
    });

    return all;
}

function clone(obj) {
    let copy = {};
    factory(obj).eachComputedProperty(function (key, meta) {
        if (meta.isAttribute) {
            copy[key] = obj.get(key);
        }
    });

    return copy;
}

let attr = function() {
    let meta = {
      isAttribute: true,
      defaults: arguments[0]
    };

    return computed({
        get(key) {
            let data = this.get("_data") || {};

            return data[key];
        },
        set(key, value) {
            let data = this.get("_data") || {};
            let dirty = this.get("_dirty") || {};
            let primed = this.get("_primed") || {};
            let defaults = this.get("_defaults") || {};

            defaults[key] = meta.defaults;

            if (!this.get("isDirty")) {
                this.set("_oldState", clone(this));
            }

            let ready = value === "" && (isNone(data[key]));

            dirty[key + ":isDirty"] = true;
            data[key] = value;

            if(!ready && !primed[key + ":isPrimed"]) {
                primed[key + ":isPrimed"] = true;
            }

            return data[key];
        }
    }).property("_data").meta(meta);
};

let Model = EmberObject.extend({
    init() {
        this._super(...arguments);
        this._reset();
        this._setup();
        this.set("_defaults", {});
        this.set("_data", clone(this));
        this.set("_oldState", clone(this));
    },
    rollback() {
        let oldState = this.get("_oldState");
        for(let key in oldState){
            this.set(key, oldState[key]);
        }
        this._reset();
    },
    save() {
        let oldState = clone(this);
        this.set("_oldState", oldState);
        this._reset();
    },
    _reset() {
        this.set("isPrimed", false);
        this.set("_dirty", {});
        this.set("_primed", {});
    },
    _setup() {
        let model = this;
        let attributes = attrs(this);

        attributes.forEach((attrName) => {
            defineProperty(model, attrName + "IsDirty", computed(function() {
                let current = this.get(attrName);
                let defaults = this.get("_defaults")[attrName];
                let original = this.get("_oldState." + attrName);
                let dirty = this.get("_dirty");
                let dirtyKey = attrName + ":isDirty";
                let legit = (equal(current, defaults) && isNone(original)) || (equal(original, current));

                return legit ? undefined : dirty[dirtyKey];
            }).property("_dirty", "_defaults", "" + attrName));

            let dynamicPrimedKey = attrName + "IsPrimed";

            defineProperty(model, dynamicPrimedKey, computed(function() {
                let primed = this.get("_primed");
                let primedKey = attrName + ":isPrimed";

                return primed[primedKey];
            }).property("_primed", "" + attrName));
        });

        let modelIsDirtyAttrs = attributes.map((attr) => attr + "IsDirty");
        defineProperty(model, "isNotDirty", not('isDirty'));

        defineProperty(model, "isDirty", computed(...modelIsDirtyAttrs, function() {
            return modelIsDirtyAttrs.some((attr) => get(model, attr) === true);
        }));
    }
});

export { attr, Model };
