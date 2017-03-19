import Ember from "ember";

const { computed, defineProperty, get } = Ember;

function equal(first, second) {
    if (first instanceof Array && second instanceof Array) {
        return first.length === second.length && first.every((v, i) => v === second[i]);
    }

    return first === second;
}

function factory(obj) {
    return obj.get("constructor.ClassMixin.ownerConstructor");
}

function attrs(obj) {
    var all = [];
    factory(obj).eachComputedProperty(function (key, meta) {
        if (meta.isAttribute) {
            all.push(key);
        }
    });

    return all;
}

function clone(obj) {
    var copy = {};
    factory(obj).eachComputedProperty(function (key, meta) {
        if (meta.isAttribute) {
            copy[key] = obj.get(key);
        }
    });

    return copy;
}

var attr = function() {
    var meta = {
      isAttribute: true,
      defaults: arguments[0]
    };

    return computed({
        get(key) {
            var data = this.get("_data") || {};

            return data[key];
        },
        set(key, value) {
            var data = this.get("_data") || {};
            var dirty = this.get("_dirty") || {};
            var primed = this.get("_primed") || {};
            var defaults = this.get("_defaults") || {};

            defaults[key] = meta.defaults;

            if (!this.get("isDirty")) {
                this.set("_oldState", clone(this));
            }

            var ready = value === "" && (Ember.isNone(data[key]));

            dirty[key + ":isDirty"] = true;
            data[key] = value;

            if(!ready && !primed[key + ":isPrimed"]) {
                primed[key + ":isPrimed"] = true;
            }

            return data[key];
        }
    }).property("_data").meta(meta);
};

var Model = Ember.Object.extend({
    init() {
        this._super(...arguments);
        this._reset();
        this._setup();
        this.set("_defaults", {});
        this.set("_data", clone(this));
        this.set("_oldState", clone(this));
    },
    rollback() {
        var oldState = this.get("_oldState");
        for(var key in oldState){
            this.set(key, oldState[key]);
        }
        this._reset();
    },
    save() {
        var oldState = clone(this);
        this.set("_oldState", oldState);
        this._reset();
    },
    _reset() {
        this.set("isPrimed", false);
        this.set("_dirty", {});
        this.set("_primed", {});
    },
    _setup() {
        var model = this;
        var attributes = attrs(this);

        attributes.forEach((attrName) => {
            defineProperty(model, attrName + "IsDirty", computed(function() {
                var current = this.get(attrName);
                var defaults = this.get("_defaults")[attrName];
                var original = this.get("_oldState." + attrName);
                var dirty = this.get("_dirty");
                var dirtyKey = attrName + ":isDirty";
                var legit = (equal(current, defaults) && Ember.isNone(original)) || (equal(original, current));

                return legit ? undefined : dirty[dirtyKey];
            }).property("_dirty", "_defaults", "" + attrName));

            var dynamicPrimedKey = attrName + "IsPrimed";

            defineProperty(model, dynamicPrimedKey, computed(function() {
                var primed = this.get("_primed");
                var primedKey = attrName + ":isPrimed";

                return primed[primedKey];
            }).property("_primed", "" + attrName));
        });

        var modelIsDirtyAttrs = attributes.map((attr) => attr + "IsDirty");
        defineProperty(model, "isNotDirty", computed.not('isDirty'));

        defineProperty(model, "isDirty", computed(...modelIsDirtyAttrs, function() {
          var modelAttrs = modelIsDirtyAttrs.filter((attr) => get(model, attr) === true);

          return modelAttrs.length > 0;
        }));
    }
});

export { attr, Model };
