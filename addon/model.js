import Ember from "ember";

function clone(obj) {
    var copy = {};
    var factory = obj.get("constructor.ClassMixin.ownerConstructor");
    factory.eachComputedProperty(function (key, meta) {
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
            this.set("isDirty", true);
            dirty["%@:isDirty".fmt(key)] = true;
            data[key] = value;
        }
        return data[key];
    }.property("_data").meta(meta);
};

var Model = Ember.Object.extend({
    init: function() {
        this.set("_data", {});
        this._reset();
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
        this.set("isDirty", false);
        this.set("_dirty", {});
    },
    unknownProperty: function(key) {
        if (key === "_dirty") { return; }
        var dirty = this.get("_dirty");
        if (key.indexOf(":isDirty") > 0) {
            return dirty[key];
        }
    }
});

export { attr, Model };
