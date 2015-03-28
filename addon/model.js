import Ember from "ember";

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
    var meta = {isAttribute: true};
    return function(key, value) {
        var data = this.get("_data") || {};
        var dirty = this.get("_dirty") || {};
        if (arguments.length === 2) {
            if (!this.get("isDirty")) {
                var oldState = clone(this);
                this.set("_oldState", oldState);
            }
            var primed = value === "" && !data[key];
            if(!primed) {
                dirty["%@:isDirty".fmt(key)] = true;
                data[key] = value;
            }
        }
        return data[key];
    }.property("_data").meta(meta);
};

var Model = Ember.Object.extend({
    init: function() {
        this.set("_data", {});
        this._reset();
        this._setup();
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
        this.set("_dirty", {});
    },
    _setup: function() {
        var self = this;
        var oldState = clone(this);
        this.set("_oldState", oldState);
        var allAttrs = "";
        attrs(this).forEach(function(attrName) {
            allAttrs += "," + attrName;
            var dynamicKey = "%@IsDirty".fmt(attrName);
            Ember.defineProperty(self, dynamicKey, Ember.computed(function() {
                var current = this.get(attrName);
                var original = this.get("_oldState." + attrName);
                var dirty = this.get("_dirty");
                var dirtyKey = "%@:isDirty".fmt(attrName);
                return original === current ? undefined : dirty[dirtyKey];
            }).property("_dirty", "" + attrName));
        });
        Ember.defineProperty(this, "isDirty", Ember.computed(function() {
            var oldState = this.get("_oldState");
            for(var key in oldState) {
                var oldValue = oldState[key];
                var value = self.get(key);
                var setBack = (oldValue === undefined || oldValue === "" || oldValue === null) &&
                    (value === "" || value === undefined || value === null);
                if(value !== oldValue && !setBack) {
                    return true;
                }
            }
            return false;
        }).property("_oldState" + allAttrs));
    }
});

export { attr, Model };
