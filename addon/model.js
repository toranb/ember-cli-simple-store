import Ember from "ember";

function equal(first, second) {
    if (first instanceof Array && second instanceof Array) {
        return Ember.$(first).not(second).get().length === 0 && Ember.$(second).not(first).get().length === 0;
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
    var meta = {isAttribute: true, defaults: arguments[0]};
    return Ember.computed({
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

            var ready = (value === "" || Ember.isNone(value)) && (Ember.isNone(data[key]));

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
    init: function() {
        this._super();
        this._reset();
        this._setup();
        this.set("_defaults", {});
        this.set("_data", clone(this));
        this.set("_oldState", clone(this));
    },
    rollback: function() {
        var oldState = this.get("_oldState");
        for(var key in oldState){
            this.set(key, oldState[key]);
        }
        this._reset();
    },
    save: function() {
        var oldState = clone(this);
        this.set("_oldState", oldState);
        this._reset();
    },
    _reset: function() {
        this.set("isPrimed", false);
        this.set("_dirty", {});
        this.set("_primed", {});
    },
    _setup: function() {
        var self = this;
        var attributes = attrs(this);
        attributes.forEach(function(attrName) {
            var dynamicDirtyKey = attrName + "IsDirty";
            Ember.defineProperty(self, dynamicDirtyKey, Ember.computed(function() {
                var current = this.get(attrName);
                var defaults = this.get("_defaults")[attrName];
                var original = this.get("_oldState." + attrName);
                var dirty = this.get("_dirty");
                var dirtyKey = attrName + ":isDirty";
                var legit = (equal(current, defaults) && Ember.isNone(original)) || (equal(original, current));
                return legit ? undefined : dirty[dirtyKey];
            }).property("_dirty", "_defaults", "" + attrName));
            var dynamicPrimedKey = attrName + "IsPrimed";
            Ember.defineProperty(self, dynamicPrimedKey, Ember.computed(function() {
                var primed = this.get("_primed");
                var primedKey = attrName + ":isPrimed";
                return primed[primedKey];
            }).property("_primed", "" + attrName));
        });
        var modelIsDirtyAttrs = [];
        attributes.forEach(function(attr) {
            modelIsDirtyAttrs.push(attr + "IsDirty");
        });
        Ember.defineProperty(this, "isNotDirty", Ember.computed.not('isDirty'));
        Ember.defineProperty(this, "isDirty", Ember.computed(function() {
            var modelAttrs = modelIsDirtyAttrs.filter(function(attr){
                return self.get(attr) === true;
            });
            return modelAttrs.length > 0;
        }).property("" + modelIsDirtyAttrs));
    }
});

export { attr, Model };
